<?php
include 'api_headers.php';
include 'db_config.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            exit();
}

$data = json_decode(file_get_contents("php://input"));
$response = array();
if (isset($data->token) && isset($data->new_password)) {
            $token = $data->token;
            $new_password = $data->new_password;
            $current_time = date("Y-m-d H:i:s");
            $stmt = $conn->prepare("SELECT email FROM password_resets WHERE token = ? AND expires_at > ?");
            $stmt->bind_param("ss", $token, $current_time);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                        $row = $result->fetch_assoc();
                        $email = $row['email'];
                        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
                        $stmt_update = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
                        $stmt_update->bind_param("ss", $hashed_password, $email);
                        if ($stmt_update->execute()) {
                                    $stmt_del = $conn->prepare("DELETE FROM password_resets WHERE email = ?");
                                    $stmt_del->bind_param("s", $email);
                                    $stmt_del->execute();
                                    $response['status'] = 'success';
                                    $response['message'] = 'Password berhasil diubah. Silakan login.';
                        } else {
                                    http_response_code(500);
                                    $response['status'] = 'error';
                                    $response['message'] = 'Gagal mengupdate password.';
                        }
            } else {
                        $response['status'] = 'error';
                        $response['message'] = 'Token tidak valid atau sudah kadaluwarsa.';
            }
} else {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Data tidak lengkap.';
}

echo json_encode($response);
$conn->close();
