<?php
include 'auth_guard.php';
include 'db_config.php';

$response = array();
$role = $authUser['role'];
if ($role != 'superadmin' && $role != 'admin_jurusan') {
            http_response_code(403);
            $response['status'] = 'error';
            $response['message'] = 'Akses ditolak. Anda tidak memiliki izin.';
            echo json_encode($response);
            die();
}
if (
            !isset($_POST['id_dosen']) ||
            !isset($_POST['nama_dosen']) ||
            !isset($_POST['nip'])
) {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Input tidak lengkap. ID, Nama, dan NIP wajib diisi.';
            echo json_encode($response);
            die();
}

$id_dosen = intval($_POST['id_dosen']);
$nama_dosen = $_POST['nama_dosen'];
$nip = $_POST['nip'];
$bidang_keahlian = $_POST['bidang_keahlian'] ?? '';
$link_google_scholar = $_POST['link_google_scholar'] ?? '';
$id_prodi = intval($_POST['id_prodi']);
$foto_profil_name = null;
if (isset($_FILES['foto_profil']) && $_FILES['foto_profil']['error'] == UPLOAD_ERR_OK) {
            $file = $_FILES['foto_profil'];
            $file_tmp_path = $file['tmp_name'];
            $file_name_original = $file['name'];
            $file_size = $file['size'];
            $file_ext = strtolower(pathinfo($file_name_original, PATHINFO_EXTENSION));
            $allowed_ext = ['jpg', 'jpeg', 'png', 'gif'];
            if (in_array($file_ext, $allowed_ext)) {
                        $foto_profil_name = $id_dosen . '-' . time() . '.' . $file_ext;
                        $target_dir = __DIR__ . '/../uploads/images/';
                        $target_file_path = $target_dir . $foto_profil_name;
                        if (!move_uploaded_file($file_tmp_path, $target_file_path)) {
                                    http_response_code(500);
                                    $response['status'] = 'error';
                                    $response['message'] = 'Gagal memindahkan file yang di-upload.';
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
$sql = "UPDATE dosen SET 
            nama_dosen = ?, 
            nip = ?, 
            bidang_keahlian = ?, 
            link_google_scholar = ?, 
            id_prodi = ?";

$params_types = "ssssi";
$params_values = [
            $nama_dosen,
            $nip,
            $bidang_keahlian,
            $link_google_scholar,
            $id_prodi
];
if ($foto_profil_name !== null) {
            $sql .= ", foto_profil = ?";
            $params_types .= "s";
            $params_values[] = $foto_profil_name;
}

$sql .= " WHERE id_dosen = ?";
$params_types .= "i";
$params_values[] = $id_dosen;
$stmt = $conn->prepare($sql);
$stmt->bind_param($params_types, ...$params_values);
if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'Data dosen berhasil diperbarui.';
            if ($foto_profil_name !== null) {
                        $response['new_image_path'] = $foto_profil_name;
            }
} else {
            http_response_code(500);
            $response['status'] = 'error';
            $response['message'] = 'Gagal memperbarui database: ' . $stmt->error;
}

$stmt->close();
echo json_encode($response);
$conn->close();
