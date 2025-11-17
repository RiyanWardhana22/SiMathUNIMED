<?php
// 1. Gembok Keamanan (WAJIB)
include 'auth_guard.php';

// 2. Koneksi DB
include 'db_config.php';

$response = array();

// 3. Cek Peran (Hanya admin)
$role = $authUser['role'];
if ($role != 'superadmin' && $role != 'admin_jurusan') {
            http_response_code(403);
            $response['status'] = 'error';
            $response['message'] = 'Akses ditolak.';
            die(json_encode($response));
}

// 4. Ambil data teks dari $_POST
if (!isset($_POST['judul']) || !isset($_FILES['gambar_file'])) {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Input tidak lengkap. Judul dan File Gambar wajib diisi.';
            die(json_encode($response));
}

$judul = $_POST['judul'];
$deskripsi_singkat = $_POST['deskripsi_singkat'] ?? '';
$link_url = $_POST['link_url'] ?? '';
$urutan = !empty($_POST['urutan']) ? intval($_POST['urutan']) : 10;

// 5. Proses File Upload
$file = $_FILES['gambar_file'];
if ($file['error'] == UPLOAD_ERR_OK) {

            $file_tmp_path = $file['tmp_name'];
            $file_name_original = $file['name'];
            $file_ext = strtolower(pathinfo($file_name_original, PATHINFO_EXTENSION));

            // Keamanan: Hanya izinkan ekstensi gambar
            $allowed_ext = ['jpg', 'jpeg', 'png', 'gif'];
            if (in_array($file_ext, $allowed_ext)) {

                        $slug_judul = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $judul)));
                        $file_name_final = 'slider-' . $slug_judul . '-' . time() . '.' . $file_ext;

                        // Target path (kita gunakan folder 'images' yang sama)
                        $target_dir = __DIR__ . '/../uploads/images/';
                        $target_file_path = $target_dir . $file_name_final;

                        if (move_uploaded_file($file_tmp_path, $target_file_path)) {
                                    // File berhasil di-upload, simpan ke DB
                                    $stmt = $conn->prepare(
                                                "INSERT INTO sliders (judul, deskripsi_singkat, gambar_path, link_url, urutan) 
                 VALUES (?, ?, ?, ?, ?)"
                                    );
                                    $stmt->bind_param("ssssi", $judul, $deskripsi_singkat, $file_name_final, $link_url, $urutan);

                                    if ($stmt->execute()) {
                                                $response['status'] = 'success';
                                                $response['message'] = 'Slider berhasil di-upload.';
                                    } else {
                                                http_response_code(500);
                                                $response['status'] = 'error';
                                                $response['message'] = 'File di-upload, tapi gagal disimpan ke DB: ' . $stmt->error;
                                    }
                                    $stmt->close();
                        } else {
                                    http_response_code(500);
                                    $response['status'] = 'error';
                                    $response['message'] = 'Gagal memindahkan file yang di-upload.';
                        }
            } else {
                        http_response_code(400);
                        $response['status'] = 'error';
                        $response['message'] = 'Format file tidak diizinkan. Hanya (jpg, jpeg, png, gif).';
            }
} else {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Terjadi error saat upload file: ' . $file['error'];
}

echo json_encode($response);
$conn->close();
