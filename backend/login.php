<?php
include 'api_headers.php';
include 'db_config.php';

$response = array();
$data = json_decode(file_get_contents("php://input"));
if (isset($data->username) && isset($data->password)) {
            $username = $data->username;
            $password = $data->password;

            $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                        $user = $result->fetch_assoc();
                        if (password_verify($password, $user['password'])) {
                                    $response['status'] = 'success';
                                    $response['message'] = 'Login berhasil.';
                                    $response['user'] = array(
                                                'id_user' => $user['id_user'],
                                                'username' => $user['username'],
                                                'nama_lengkap' => $user['nama_lengkap'],
                                                'role' => $user['role']
                                    );
                        } else {
                                    $response['status'] = 'error';
                                    $response['message'] = 'Password yang Anda masukkan salah.';
                        }
            } else {
                        $response['status'] = 'error';
                        $response['message'] = 'Username tidak ditemukan.';
            }
            $stmt->close();
} else {
            $response['status'] = 'error';
            $response['message'] = 'Username dan Password wajib diisi.';
}

echo json_encode($response);
$conn->close();
