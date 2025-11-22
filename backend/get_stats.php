<?php
include 'api_headers.php';
include 'db_config.php';

$response = array();
$response['data'] = array();

try {
            $res = $conn->query("SELECT COUNT(*) as total FROM dosen");
            $response['data']['dosen'] = $res->fetch_assoc()['total'];

            $res = $conn->query("SELECT COUNT(*) as total FROM berita");
            $response['data']['berita'] = $res->fetch_assoc()['total'];

            $res = $conn->query("SELECT COUNT(*) as total FROM dokumen");
            $response['data']['dokumen'] = $res->fetch_assoc()['total'];

            $res = $conn->query("SELECT COUNT(*) as total FROM sliders");
            $response['data']['slider'] = $res->fetch_assoc()['total'];

            $response['status'] = 'success';
} catch (Exception $e) {
            http_response_code(500);
            $response['status'] = 'error';
            $response['message'] = $e->getMessage();
}

echo json_encode($response);
$conn->close();
