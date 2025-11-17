<?php
// API Publik, hanya butuh CORS
include 'api_headers.php';
include 'db_config.php';

$response = array();

// Ambil semua slider yang 'is_active' = 1, urutkan berdasarkan 'urutan'
$sql = "SELECT id_slider, judul, deskripsi_singkat, gambar_path, link_url 
        FROM sliders 
        WHERE is_active = 1 
        ORDER BY urutan ASC, id_slider DESC";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
            $response['status'] = 'success';
            $response['data'] = $result->fetch_all(MYSQLI_ASSOC);
} else {
            $response['status'] = 'empty';
            $response['message'] = 'Tidak ada slider aktif ditemukan.';
}

echo json_encode($response);
$conn->close();
