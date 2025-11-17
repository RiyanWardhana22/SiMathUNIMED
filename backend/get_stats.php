<?php
include 'api_headers.php';
include 'db_config.php';

$response = array();
$response['data'] = array();
try {
            $result_dosen = $conn->query("SELECT COUNT(id_dosen) AS total FROM dosen");
            $response['data']['jumlah_dosen'] = $result_dosen->fetch_assoc()['total'];
            $result_mahasiswa = $conn->query("SELECT COUNT(id_user) AS total FROM users WHERE role = 'mahasiswa'");
            $response['data']['jumlah_mahasiswa'] = $result_mahasiswa->fetch_assoc()['total'];

            $result_prestasi = $conn->query("SELECT COUNT(id_berita) AS total FROM berita WHERE kategori = 'prestasi'");
            $response['data']['jumlah_prestasi'] = $result_prestasi->fetch_assoc()['total'];

            $response['status'] = 'success';
} catch (Exception $e) {
            http_response_code(500);
            $response['status'] = 'error';
            $response['message'] = 'Gagal mengambil data statistik: ' . $e->getMessage();
}

echo json_encode($response);
$conn->close();
