<?php
include 'auth_guard.php';
include 'db_config.php';

$response = array();
$role = $authUser['role'];
if ($role != 'superadmin' && $role != 'admin_jurusan') {
            http_response_code(403);
            $response['status'] = 'error';
            $response['message'] = 'Akses ditolak.';
            die(json_encode($response));
}

$data = json_decode(file_get_contents("php://input"));
if (isset($data->id) && isset($data->gambar_path)) {
            $id_slider = intval($data->id);
            $gambar_path = $data->gambar_path;
            $target_file = __DIR__ . '/../uploads/images/' . basename($gambar_path);

            $file_deleted = false;
            if (file_exists($target_file)) {
                        if (unlink($target_file)) {
                                    $file_deleted = true;
                        }
            } else {
                        $file_deleted = true;
            }

            if ($file_deleted) {
                        $stmt = $conn->prepare("DELETE FROM sliders WHERE id_slider = ?");
                        $stmt->bind_param("i", $id_slider);
                        if ($stmt->execute()) {
                                    $response['status'] = 'success';
                                    $response['message'] = 'Slider berhasil dihapus.';
                        } else {
                                    http_response_code(500);
                                    $response['status'] = 'error';
                                    $response['message'] = 'File fisik dihapus, tapi gagal hapus data DB: ' . $stmt->error;
                        }
                        $stmt->close();
            } else {
                        http_response_code(500);
                        $response['status'] = 'error';
                        $response['message'] = 'Gagal menghapus file fisik di server.';
            }
} else {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Input tidak lengkap. "id" dan "gambar_path" wajib diisi.';
}

echo json_encode($response);
$conn->close();
