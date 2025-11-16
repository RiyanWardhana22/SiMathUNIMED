<?php
// 1. Gembok Keamanan (WAJIB)
include 'auth_guard.php';

// 2. Koneksi DB (auth_guard sudah urus CORS)
include 'db_config.php';

$response = array();

// 3. Cek Peran (Hanya admin)
$role = $authUser['role'];
if ($role != 'superadmin' && $role != 'admin_jurusan') {
            http_response_code(403);
            $response['status'] = 'error';
            $response['message'] = 'Akses ditolak. Anda tidak memiliki izin.';
            echo json_encode($response);
            die();
}

// 4. Ambil data JSON (kita butuh ID dan file_path)
$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->file_path)) {
            $id_dokumen = intval($data->id);
            $file_path = $data->file_path; // Nama file: 'kurikulum-12345.pdf'

            // 5. Hapus file fisik dari server
            $target_file = __DIR__ . '/../uploads/documents/' . basename($file_path);

            $file_deleted = false;
            if (file_exists($target_file)) {
                        if (unlink($target_file)) {
                                    $file_deleted = true;
                        }
            } else {
                        // File tidak ada di server, tapi kita tetap boleh hapus data DB
                        $file_deleted = true; // Anggap sukses agar bisa lanjut hapus DB
            }

            if ($file_deleted) {
                        // 6. Hapus data dari Database
                        $stmt = $conn->prepare("DELETE FROM dokumen WHERE id_dokumen = ?");
                        $stmt->bind_param("i", $id_dokumen);

                        if ($stmt->execute()) {
                                    $response['status'] = 'success';
                                    $response['message'] = 'Dokumen berhasil dihapus (file dan data).';
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
            $response['message'] = 'Input tidak lengkap. "id" dan "file_path" wajib diisi.';
}

echo json_encode($response);
$conn->close();
