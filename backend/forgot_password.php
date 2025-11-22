<?php
include 'api_headers.php';
include 'db_config.php';
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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
if (isset($data->email)) {
            $email = $data->email;
            $stmt = $conn->prepare("SELECT id_user FROM users WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                        $token = bin2hex(random_bytes(32));
                        $expires_at = date("Y-m-d H:i:s", strtotime('+1 hour'));
                        $conn->query("DELETE FROM password_resets WHERE email = '$email'");
                        $stmt_insert = $conn->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)");
                        $stmt_insert->bind_param("sss", $email, $token, $expires_at);
                        if ($stmt_insert->execute()) {
                                    $mail = new PHPMailer(true);
                                    try {
                                                $mail->isSMTP();
                                                $mail->Host       = 'smtp.gmail.com';
                                                $mail->SMTPAuth   = true;
                                                $mail->Username   = 'supermie768@gmail.com'; // Email Anda
                                                $mail->Password   = 'ygdd hadt zcuu avjl';    // App Password Anda
                                                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                                                $mail->Port       = 587;

                                                $mail->setFrom('no-reply@simathunimed.com', 'SiMathUNIMED Admin');
                                                $mail->addAddress($email);
                                                $resetLink = "http://localhost:5173/reset-password?token=" . $token;
                                                $mail->isHTML(true);
                                                $mail->Subject = 'Reset Password SiMathUNIMED';
                                                $mail->Body    = "Klik link berikut untuk mereset password Anda:<br><br><a href='$resetLink'>$resetLink</a><br><br>Link ini berlaku selama 1 jam.";
                                                $mail->send();
                                                $response['status'] = 'success';
                                                $response['message'] = 'Link reset password telah dikirim ke email Anda.';
                                    } catch (Exception $e) {
                                                http_response_code(500);
                                                $response['status'] = 'error';
                                                $response['message'] = 'Gagal mengirim email. Mailer Error: ' . $mail->ErrorInfo;
                                    }
                        } else {
                                    http_response_code(500);
                                    $response['status'] = 'error';
                                    $response['message'] = 'Gagal menyimpan token ke database.';
                        }
            } else {
                        $response['status'] = 'error';
                        $response['message'] = 'Email tidak terdaftar dalam sistem.';
            }
} else {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Email wajib diisi.';
}

echo json_encode($response);
$conn->close();
