<?php
include 'auth_guard.php';
include 'db_config.php';

$response = array();
$data = json_decode(file_get_contents("php://input"));
if (
            !isset($data->id_prodi) ||
            !isset($data->deskripsi) ||
            !isset($data->visi) ||
            !isset($data->misi) ||
            !isset($data->profil_lulusan)
) {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Input tidak lengkap. Semua field wajib diisi.';
            echo json_encode($response);
            die();
}

$role = $authUser['role'];
if ($role == 'superadmin' || $role == 'admin_jurusan' || $role == 'admin_prodi') {
            $id_prodi = intval($data->id_prodi);
            $deskripsi = $data->deskripsi;
            $visi = $data->visi;
            $misi = $data->misi;
            $profil_lulusan = $data->profil_lulusan;
            $stmt = $conn->prepare(
                        "UPDATE program_studi 
         SET deskripsi = ?, visi = ?, misi = ?, profil_lulusan = ?
         WHERE id_prodi = ?"
            );
            $stmt->bind_param("ssssi", $deskripsi, $visi, $misi, $profil_lulusan, $id_prodi);
            if ($stmt->execute()) {
                        if ($stmt->affected_rows > 0) {
                                    $response['status'] = 'success';
                                    $response['message'] = 'Data program studi berhasil diperbarui.';
                        } else {
                                    $response['status'] = 'info';
                                    $response['message'] = 'Tidak ada perubahan data yang disimpan.';
                        }
            } else {
                        http_response_code(500);
                        $response['status'] = 'error';
                        $response['message'] = 'Gagal memperbarui database: ' . $stmt->error;
            }

            $stmt->close();
} else {
            http_response_code(403);
            $response['status'] = 'error';
            $response['message'] = 'Akses ditolak. Anda tidak memiliki izin untuk mengedit.';
}

echo json_encode($response);
$conn->close();
