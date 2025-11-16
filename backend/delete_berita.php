<?php
include 'auth_guard.php';
include 'db_config.php';

$data = json_decode(file_get_contents("php://input"));
$response = array();
if (isset($data->id) && !empty($data->id)) {
            $role = $authUser['role'];
            if ($role == 'superadmin' || $role == 'admin_jurusan') {
                        $id_berita = intval($data->id);
                        $stmt = $conn->prepare("DELETE FROM berita WHERE id_berita = ?");
                        $stmt->bind_param("i", $id_berita);
                        if ($stmt->execute()) {
                                    if ($stmt->affected_rows > 0) {
                                                $response['status'] = 'success';
                                                $response['message'] = 'Postingan berhasil dihapus.';
                                    } else {
                                                http_response_code(404);
                                                $response['status'] = 'error';
                                                $response['message'] = 'Postingan dengan ID ' . $id_berita . ' tidak ditemukan.';
                                    }
                        } else {
                                    http_response_code(500);
                                    $response['status'] = 'error';
                                    $response['message'] = 'Gagal menghapus dari database: ' . $stmt->error;
                        }

                        $stmt->close();
            } else {
                        http_response_code(403);
                        $response['status'] = 'error';
                        $response['message'] = 'Akses ditolak. Anda tidak memiliki izin untuk menghapus postingan.';
            }
} else {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Input tidak lengkap. "id" wajib diisi.';
}

echo json_encode($response);
$conn->close();
