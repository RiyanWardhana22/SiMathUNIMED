<?php
include 'api_headers.php';
include 'db_config.php';

$response = array();

$sql = "SELECT setting_key, setting_value FROM site_settings";
$result = $conn->query($sql);

if ($result) {
            $response['status'] = 'success';
            $response['data'] = array();
            while ($row = $result->fetch_assoc()) {
                        $response['data'][$row['setting_key']] = $row['setting_value'];
            }
} else {
            http_response_code(500);
            $response['status'] = 'error';
            $response['message'] = 'Gagal mengambil pengaturan: ' . $conn->error;
}

echo json_encode($response);
$conn->close();
