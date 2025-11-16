<?php
include 'auth_guard.php';

// 2. Headers dan koneksi DB
include 'db_config.php'; // (auth_guard sudah urus CORS)

$response = array();

// 3. Cek Peran (Hanya admin)
$role = $authUser['role'];
if ($role != 'superadmin' && $role != 'admin_jurusan') {
            http_response_code(403);
            $response['status'] = 'error';
            $response['message'] = 'Akses ditolak. Anda tidak memiliki izin untuk meng-upload dokumen.';
            echo json_encode($response);
            die();
}

// 4. Ambil data teks dari $_POST
if (
            !isset($_POST['nama_dokumen']) ||
            !isset($_POST['kategori']) ||
            !isset($_FILES['dokumen_file']) // Pastikan file ada
) {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Input tidak lengkap. Nama, Kategori, dan File wajib diisi.';
            echo json_encode($response);
            die();
}

$nama_dokumen = $_POST['nama_dokumen'];
$kategori = $_POST['kategori'];
// id_prodi bersifat opsional (bisa NULL jika ini dokumen jurusan)
$id_prodi = !empty($_POST['id_prodi']) ? intval($_POST['id_prodi']) : null;

// 5. Proses File Upload
$file = $_FILES['dokumen_file'];
if ($file['error'] == UPLOAD_ERR_OK) {

            $file_tmp_path = $file['tmp_name'];
            $file_name_original = $file['name'];
            $file_ext = strtolower(pathinfo($file_name_original, PATHINFO_EXTENSION));

            // Keamanan: Izinkan ekstensi dokumen yang umum
            $allowed_ext = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
            if (in_array($file_ext, $allowed_ext)) {

                        // Buat nama file aman (misal: kurikulum-matematika-1678886400.pdf)
                        $slug_nama = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $nama_dokumen)));
                        $file_name_final = $slug_nama . '-' . time() . '.' . $file_ext;

                        // Target path (keluar dari 'backend/' masuk ke 'uploads/documents/')
                        $target_dir = __DIR__ . '/../uploads/documents/';
                        $target_file_path = $target_dir . $file_name_final;

                        if (move_uploaded_file($file_tmp_path, $target_file_path)) {
                                    // File berhasil di-upload, sekarang simpan ke DB

                                    $stmt = $conn->prepare(
                                                "INSERT INTO dokumen (nama_dokumen, file_path, kategori, id_prodi) 
                 VALUES (?, ?, ?, ?)"
                                    );

                                    // Perlu 'bind_param' khusus untuk id_prodi (bisa null)
                                    if ($id_prodi === null) {
                                                $stmt->bind_param("sssi", $nama_dokumen, $file_name_final, $kategori, $id_prodi_null);
                                                $id_prodi_null = null; // Bind sebagai null
                                    } else {
                                                $stmt->bind_param("sssi", $nama_dokumen, $file_name_final, $kategori, $id_prodi);
                                    }

                                    if ($stmt->execute()) {
                                                $response['status'] = 'success';
                                                $response['message'] = 'Dokumen berhasil di-upload dan disimpan.';
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
                        $response['message'] = 'Format file tidak diizinkan. Hanya (pdf, doc(x), xls(x), ppt(x)).';
            }
} else {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Terjadi error saat upload file: ' . $file['error'];
}

echo json_encode($response);
$conn->close();
