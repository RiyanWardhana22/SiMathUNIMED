<?php
include 'auth_guard.php';
include 'db_config.php';

$response = array();
if ($authUser['role'] != 'superadmin') {
            http_response_code(403);
            die(json_encode(['status' => 'error', 'message' => 'Akses ditolak.']));
}

$sql = "SELECT id_user, username, nama_lengkap, email, role FROM users ORDER BY role, nama_lengkap";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
            $response['status'] = 'success';
            $response['data'] = $result->fetch_all(MYSQLI_ASSOC);
} else {
            $response['status'] = 'empty';
            $response['data'] = [];
}

echo json_encode($response);
$conn->close();
