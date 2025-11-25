<?php
include 'api_headers.php';
include 'db_config.php';

$response = array();
function generateTicket($length = 6)
{
            $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $randomString = '';
            for ($i = 0; $i < $length; $i++) {
                        $randomString .= $characters[rand(0, strlen($characters) - 1)];
            }
            return 'ADU-' . $randomString;
}

if (isset($_POST['judul']) && isset($_POST['isi']) && isset($_POST['klasifikasi'])) {

            $kode_tiket = generateTicket();
            $klasifikasi = $_POST['klasifikasi'];
            $kategori = $_POST['kategori'];
            $judul = $_POST['judul'];
            $isi = $_POST['isi'];
            $file_path = NULL;

            if (isset($_FILES['lampiran']) && $_FILES['lampiran']['error'] == UPLOAD_ERR_OK) {
                        $file = $_FILES['lampiran'];
                        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                        $allowed = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
                        if (in_array($ext, $allowed)) {
                                    $new_name = 'aduan-' . time() . '.' . $ext;
                                    $target = __DIR__ . '/../uploads/documents/' . $new_name;
                                    if (move_uploaded_file($file['tmp_name'], $target)) {
                                                $file_path = $new_name;
                                    }
                        }
            }

            $stmt = $conn->prepare("INSERT INTO pengaduan (kode_tiket, klasifikasi, kategori, judul, isi, file_path) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssss", $kode_tiket, $klasifikasi, $kategori, $judul, $isi, $file_path);

            if ($stmt->execute()) {
                        $response['status'] = 'success';
                        $response['message'] = 'Laporan berhasil dikirim.';
                        $response['ticket'] = $kode_tiket;
            } else {
                        $response['status'] = 'error';
                        $response['message'] = 'Gagal menyimpan laporan.';
            }
            $stmt->close();
} else {
            $response['status'] = 'error';
            $response['message'] = 'Data tidak lengkap.';
}

echo json_encode($response);
$conn->close();
