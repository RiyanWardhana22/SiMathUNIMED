<?php
include 'auth_guard.php';
include 'db_config.php';

$response = array();
$role = $authUser['role'];
if ($role != 'superadmin' && $role != 'admin_jurusan') {
            http_response_code(403);
            $response['status'] = 'error';
            $response['message'] = 'Akses ditolak. Anda tidak memiliki izin untuk mengubah pengaturan.';
            echo json_encode($response);
            die();
}
if (isset($_FILES['gambar_struktur']) && $_FILES['gambar_struktur']['error'] == UPLOAD_ERR_OK) {
            $file = $_FILES['gambar_struktur'];
            $file_tmp_path = $file['tmp_name'];
            $file_name_original = $file['name'];
            $file_ext = strtolower(pathinfo($file_name_original, PATHINFO_EXTENSION));
            $allowed_ext = ['jpg', 'jpeg', 'png', 'gif'];
            if (in_array($file_ext, $allowed_ext)) {
                        $file_name_final = 'struktur-organisasi-' . time() . '.' . $file_ext;
                        $target_dir = __DIR__ . '/../uploads/images/';
                        $target_file_path = $target_dir . $file_name_final;
                        if (move_uploaded_file($file_tmp_path, $target_file_path)) {
                                    $stmt_file = $conn->prepare("UPDATE site_settings SET setting_value = ? WHERE setting_key = 'gambar_struktur_organisasi'");
                                    $stmt_file->bind_param("s", $file_name_final);
                                    $stmt_file->execute();
                                    $stmt_file->close();
                        } else {
                                    http_response_code(500);
                                    $response['status'] = 'error';
                                    $response['message'] = 'Gagal memindahkan file struktur organisasi.';
                                    echo json_encode($response);
                                    die();
                        }
            } else {
                        http_response_code(400);
                        $response['status'] = 'error';
                        $response['message'] = 'Format file tidak diizinkan. Hanya (jpg, jpeg, png, gif).';
                        echo json_encode($response);
                        die();
            }
}
$text_settings = [
            'visi_jurusan',
            'misi_jurusan',
            'sejarah_jurusan',
            'sambutan_ketua_jurusan'
];

$stmt_text = $conn->prepare("UPDATE site_settings SET setting_value = ? WHERE setting_key = ?");

foreach ($text_settings as $key) {
            if (isset($_POST[$key])) {
                        $value = $_POST[$key];
                        $stmt_text->bind_param("ss", $value, $key);
                        $stmt_text->execute();
            }
}
$stmt_text->close();

$response['status'] = 'success';
$response['message'] = 'Pengaturan website berhasil diperbarui.';
echo json_encode($response);

$conn->close();
