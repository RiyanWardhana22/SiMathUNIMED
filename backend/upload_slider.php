<?php
include 'auth_guard.php';
include 'db_config.php';

$response = array();
$role = $authUser['role'];
if ($role != 'superadmin' && $role != 'admin_jurusan') {
            http_response_code(403);
            die(json_encode(['status' => 'error', 'message' => 'Akses ditolak.']));
}

if (!isset($_POST['judul']) || !isset($_FILES['gambar_file'])) {
            http_response_code(400);
            die(json_encode(['status' => 'error', 'message' => 'Judul dan File Gambar wajib diisi.']));
}

$judul = $_POST['judul'];
$link_url = $_POST['link_url'] ?? '';
$urutan = !empty($_POST['urutan']) ? intval($_POST['urutan']) : 1;

$file = $_FILES['gambar_file'];
if ($file['error'] == UPLOAD_ERR_OK) {
            $file_tmp_path = $file['tmp_name'];
            $file_name_original = $file['name'];
            $file_ext = strtolower(pathinfo($file_name_original, PATHINFO_EXTENSION));
            $allowed_ext = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            if (in_array($file_ext, $allowed_ext)) {
                        $slug_judul = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $judul)));
                        $file_name_final = 'slider-' . $slug_judul . '-' . time() . '.' . $file_ext;
                        $target_dir = __DIR__ . '/../uploads/images/';
                        $target_file_path = $target_dir . $file_name_final;
                        if (move_uploaded_file($file_tmp_path, $target_file_path)) {
                                    $stmt = $conn->prepare(
                                                "INSERT INTO sliders (judul, gambar_path, link_url, urutan) 
                 VALUES (?, ?, ?, ?)"
                                    );
                                    $stmt->bind_param("sssi", $judul, $file_name_final, $link_url, $urutan);
                                    if ($stmt->execute()) {
                                                $response['status'] = 'success';
                                                $response['message'] = 'Slider berhasil di-upload.';
                                    } else {
                                                http_response_code(500);
                                                $response['status'] = 'error';
                                                $response['message'] = 'Db Error: ' . $stmt->error;
                                    }
                                    $stmt->close();
                        } else {
                                    http_response_code(500);
                                    $response['status'] = 'error';
                                    $response['message'] = 'Gagal memindahkan file.';
                        }
            } else {
                        http_response_code(400);
                        $response['status'] = 'error';
                        $response['message'] = 'Format file tidak valid.';
            }
} else {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Error upload: ' . $file['error'];
}

echo json_encode($response);
$conn->close();
