<?php
include 'auth_guard.php';
include 'db_config.php';

$data = json_decode(file_get_contents("php://input"));
$response = array();
if (
            isset($data->id) && !empty($data->id) &&
            isset($data->judul) && !empty($data->judul) &&
            isset($data->isi_berita) &&
            isset($data->kategori) && !empty($data->kategori)
) {
            $role = $authUser['role'];
            if ($role == 'superadmin' || $role == 'admin_jurusan') {
                        $id_berita = intval($data->id);
                        $judul = $data->judul;
                        $isi_berita = $data->isi_berita;
                        $kategori = $data->kategori;
                        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $judul)));
                        $stmt = $conn->prepare(
                                    "UPDATE berita 
             SET judul = ?, slug = ?, isi_berita = ?, kategori = ? 
             WHERE id_berita = ?"
                        );
                        $stmt->bind_param("ssssi", $judul, $slug, $isi_berita, $kategori, $id_berita);
                        if ($stmt->execute()) {
                                    if ($stmt->affected_rows > 0) {
                                                $response['status'] = 'success';
                                                $response['message'] = 'Postingan berhasil diperbarui.';
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
} else {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Input tidak lengkap. ID, Judul, Isi, dan Kategori wajib diisi.';
}

echo json_encode($response);
$conn->close();
