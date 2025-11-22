<?php
include 'auth_guard.php';
include 'db_config.php';

$data = json_decode(file_get_contents("php://input"));
$response = array();

$role = $authUser['role'];
if ($role != 'superadmin' && $role != 'admin_jurusan') {
            http_response_code(403);
            die(json_encode(['status' => 'error', 'message' => 'Akses ditolak.']));
}

if (isset($data->action)) {

            if ($data->action == 'add') {
                        $id_dosen = $data->id_dosen;
                        $jenjang = $data->jenjang;
                        $universitas = $data->universitas;
                        $jurusan = $data->jurusan;
                        $tahun = $data->tahun_lulus;

                        $stmt = $conn->prepare("INSERT INTO dosen_pendidikan (id_dosen, jenjang, universitas, jurusan, tahun_lulus) VALUES (?, ?, ?, ?, ?)");
                        $stmt->bind_param("issss", $id_dosen, $jenjang, $universitas, $jurusan, $tahun);

                        if ($stmt->execute()) {
                                    $response['status'] = 'success';
                                    $response['message'] = 'Riwayat pendidikan ditambahkan.';
                        } else {
                                    $response['status'] = 'error';
                                    $response['message'] = 'Gagal menyimpan.';
                        }
                        $stmt->close();
            } elseif ($data->action == 'delete') {
                        $id_pendidikan = $data->id_pendidikan;
                        $stmt = $conn->prepare("DELETE FROM dosen_pendidikan WHERE id_pendidikan = ?");
                        $stmt->bind_param("i", $id_pendidikan);

                        if ($stmt->execute()) {
                                    $response['status'] = 'success';
                                    $response['message'] = 'Riwayat pendidikan dihapus.';
                        } else {
                                    $response['status'] = 'error';
                                    $response['message'] = 'Gagal menghapus.';
                        }
                        $stmt->close();
            }
} else {
            $response['status'] = 'error';
            $response['message'] = 'Action tidak valid.';
}

echo json_encode($response);
$conn->close();
