<?php
include 'api_headers.php';
include 'db_config.php';

$response = array();
$sql = "SELECT 
            d.id_dosen, 
            d.nama_dosen, 
            d.nip, 
            d.foto_profil, 
            d.bidang_keahlian,
            p.nama_prodi 
        FROM 
            dosen d 
        LEFT JOIN 
            program_studi p ON d.id_prodi = p.id_prodi";

$result = $conn->query($sql);
if ($result->num_rows > 0) {
            $response['status'] = 'success';
            $response['data'] = array();

            while ($row = $result->fetch_assoc()) {
                        array_push($response['data'], $row);
            }
} else {
            $response['status'] = 'empty';
            $response['message'] = 'Tidak ada data dosen ditemukan.';
}

echo json_encode($response);
$conn->close();
