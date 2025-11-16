<?php
include 'auth_guard.php';
include 'db_config.php';

$response = array();
if (isset($_GET['id'])) {
            $role = $authUser['role'];
            if ($role == 'superadmin' || $role == 'admin_jurusan' || $role == 'admin_prodi') {
                        $id_berita = intval($_GET['id']);
                        $stmt = $conn->prepare("SELECT * FROM berita WHERE id_berita = ?");
                        $stmt->bind_param("i", $id_berita);
                        if ($stmt->execute()) {
                                    $result = $stmt->get_result();
                                    if ($result->num_rows > 0) {
                                                $response['status'] = 'success';
                                                $response['data'] = $result->fetch_assoc();
                                    } else {
                                                http_response_code(404);
                                                $response['status'] = 'error';
                                                $response['message'] = 'Postingan tidak ditemukan.';
                                    }
                        } else {
                                    http_response_code(500);
                                    $response['status'] = 'error';
                                    $response['message'] = 'Query gagal: ' . $stmt->error;
                        }
                        $stmt->close();
            } else {
                        http_response_code(403);
                        $response['status'] = 'error';
                        $response['message'] = 'Akses ditolak. Peran tidak diizinkan.';
            }
} else {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Parameter "id" wajib diisi.';
}

echo json_encode($response);
$conn->close();
