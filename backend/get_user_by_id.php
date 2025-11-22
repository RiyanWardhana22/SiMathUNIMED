<?php
include 'auth_guard.php';
include 'db_config.php';

$response = array();
if ($authUser['role'] != 'superadmin') {
            http_response_code(403);
            die(json_encode(['status' => 'error', 'message' => 'Akses ditolak.']));
}

if (isset($_GET['id'])) {
            $id_user = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT id_user, username, nama_lengkap, email, role FROM users WHERE id_user = ?");
            $stmt->bind_param("i", $id_user);

            if ($stmt->execute()) {
                        $result = $stmt->get_result();
                        if ($result->num_rows > 0) {
                                    $response['status'] = 'success';
                                    $response['data'] = $result->fetch_assoc();
                        } else {
                                    http_response_code(404);
                                    $response['status'] = 'error';
                                    $response['message'] = 'User tidak ditemukan.';
                        }
            } else {
                        http_response_code(500);
                        $response['status'] = 'error';
                        $response['message'] = 'Query gagal.';
            }
            $stmt->close();
} else {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'ID wajib diisi.';
}

echo json_encode($response);
$conn->close();
