<?php
// Ini adalah API publik, jadi tidak perlu auth_guard
include 'api_headers.php'; // Hanya butuh header CORS
include 'db_config.php';

$response = array();

// Kita JOIN dengan prodi untuk mendapatkan nama prodi
$sql = "SELECT 
            d.id_dokumen, 
            d.nama_dokumen, 
            d.file_path, 
            d.kategori,
            p.nama_prodi 
        FROM 
            dokumen d 
        LEFT JOIN 
            program_studi p ON d.id_prodi = p.id_prodi
        ORDER BY 
            d.kategori, d.nama_dokumen";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
            $response['status'] = 'success';
            $response['data'] = array();
            while ($row = $result->fetch_assoc()) {
                        array_push($response['data'], $row);
            }
} else {
            $response['status'] = 'empty';
            $response['message'] = 'Tidak ada dokumen ditemukan.';
}

echo json_encode($response);
$conn->close();
