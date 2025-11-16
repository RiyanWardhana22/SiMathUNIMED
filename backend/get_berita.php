<?php
include 'api_headers.php';
include 'db_config.php';

$response = array();
$sql = "SELECT 
            b.id_berita, 
            b.judul, 
            b.slug, 
            b.gambar_header,
            b.kategori,
            b.tanggal_publish,
            u.nama_lengkap AS nama_penulis
        FROM 
            berita b 
        LEFT JOIN 
            users u ON b.id_penulis = u.id_user
        ORDER BY 
            b.tanggal_publish DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
            $response['status'] = 'success';
            $response['data'] = array();
            while ($row = $result->fetch_assoc()) {
                        array_push($response['data'], $row);
            }
} else {
            $response['status'] = 'empty';
            $response['message'] = 'Tidak ada berita atau event ditemukan.';
}

echo json_encode($response);
$conn->close();
