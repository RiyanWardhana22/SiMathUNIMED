<?php
include 'auth_guard.php';
include 'db_config.php';

$data = json_decode(file_get_contents("php://input"));
$response = array();
if ($authUser['role'] != 'superadmin') {
            http_response_code(403);
            die(json_encode(['status' => 'error', 'message' => 'Akses ditolak.']));
}

if (isset($data->id)) {
            $id_hapus = intval($data->id);
            if ($id_hapus == $authUser['id_user']) {
                        http_response_code(400);
                        die(json_encode(['status' => 'error', 'message' => 'Anda tidak bisa menghapus akun sendiri saat sedang login.']));
            }

            $stmt = $conn->prepare("DELETE FROM users WHERE id_user = ?");
            $stmt->bind_param("i", $id_hapus);

            if ($stmt->execute()) {
                        $response['status'] = 'success';
                        $response['message'] = 'Pengguna berhasil dihapus.';
            } else {
                        http_response_code(500);
                        $response['status'] = 'error';
                        $response['message'] = 'Gagal menghapus: ' . $stmt->error;
            }
            $stmt->close();
} else {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'ID User wajib diisi.';
}

echo json_encode($response);
$conn->close();
