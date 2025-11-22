<?php
include 'auth_guard.php';
include 'db_config.php';

$response = array();
$role = $authUser['role'];
if ($role != 'superadmin' && $role != 'admin_jurusan') {
            http_response_code(403);
            $response['status'] = 'error';
            $response['message'] = 'Akses ditolak.';
            echo json_encode($response);
            die();
}

if (
            !isset($_POST['nama_dosen']) ||
            !isset($_POST['nip']) ||
            !isset($_POST['id_prodi'])
) {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Nama, NIP, dan Prodi wajib diisi.';
            echo json_encode($response);
            die();
}

$nama_dosen = $_POST['nama_dosen'];
$nip = $_POST['nip'];
$id_prodi = intval($_POST['id_prodi']);
$bidang_keahlian = $_POST['bidang_keahlian'] ?? '';
$link_google_scholar = $_POST['link_google_scholar'] ?? '';

$foto_profil_name = 'default.jpg';

if (isset($_FILES['foto_profil']) && $_FILES['foto_profil']['error'] == UPLOAD_ERR_OK) {
            $file = $_FILES['foto_profil'];
            $file_name_original = $file['name'];
            $file_ext = strtolower(pathinfo($file_name_original, PATHINFO_EXTENSION));
            $allowed_ext = ['jpg', 'jpeg', 'png', 'gif'];

            if (in_array($file_ext, $allowed_ext)) {
                        $foto_profil_name = $nip . '-' . time() . '.' . $file_ext;
                        $target_dir = __DIR__ . '/../uploads/images/';
                        $target_file = $target_dir . $foto_profil_name;

                        if (!move_uploaded_file($file['tmp_name'], $target_file)) {
                                    http_response_code(500);
                                    $response['status'] = 'error';
                                    $response['message'] = 'Gagal meng-upload foto.';
                                    echo json_encode($response);
                                    die();
                        }
            } else {
                        http_response_code(400);
                        $response['status'] = 'error';
                        $response['message'] = 'Format foto tidak valid (hanya jpg, png, gif).';
                        echo json_encode($response);
                        die();
            }
}

$stmt = $conn->prepare("INSERT INTO dosen (nama_dosen, nip, id_prodi, bidang_keahlian, link_google_scholar, foto_profil) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssisss", $nama_dosen, $nip, $id_prodi, $bidang_keahlian, $link_google_scholar, $foto_profil_name);

if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'Dosen berhasil ditambahkan.';
} else {
            http_response_code(500);
            $response['status'] = 'error';
            if ($conn->errno == 1062) {
                        $response['message'] = 'NIP sudah terdaftar.';
            } else {
                        $response['message'] = 'Gagal menyimpan ke database: ' . $stmt->error;
            }
}

$stmt->close();
echo json_encode($response);
$conn->close();
