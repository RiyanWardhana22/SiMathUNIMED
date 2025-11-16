<?php
include 'api_headers.php';
include 'db_config.php';

$response = array();

$sql = "SELECT id_prodi, nama_prodi, deskripsi, visi, misi FROM program_studi";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
            $response['status'] = 'success';
            $response['data'] = array();
            while ($row = $result->fetch_assoc()) {
                        array_push($response['data'], $row);
            }
} else {
            $response['status'] = 'empty';
            $response['message'] = 'Tidak ada data program studi ditemukan.';
}

echo json_encode($response);

$conn->close();
