<?php
include 'api_headers.php';
include 'db_config.php';

$response = array();
if (isset($_GET['tiket'])) {
            $tiket = $_GET['tiket'];
            $stmt = $conn->prepare("SELECT * FROM pengaduan WHERE kode_tiket = ?");
            $stmt->bind_param("s", $tiket);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                        $response['status'] = 'success';
                        $response['data'] = $result->fetch_assoc();
            } else {
                        $response['status'] = 'not_found';
                        $response['message'] = 'Kode tiket tidak ditemukan.';
            }
            $stmt->close();
}

echo json_encode($response);
$conn->close();
