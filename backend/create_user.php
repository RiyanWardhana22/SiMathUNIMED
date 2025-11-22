<?php
include 'auth_guard.php';
include 'db_config.php';

$data = json_decode(file_get_contents("php://input"));
$response = array();
if ($authUser['role'] != 'superadmin') {
            http_response_code(403);
            die(json_encode(['status' => 'error', 'message' => 'Akses ditolak.']));
}

if (
            !isset($data->username) || !isset($data->password) ||
            !isset($data->nama_lengkap) || !isset($data->email) || !isset($data->role)
) {
            http_response_code(400);
            die(json_encode(['status' => 'error', 'message' => 'Semua field wajib diisi.']));
}

$username = $data->username;
$password = $data->password;
$nama = $data->nama_lengkap;
$email = $data->email;
$role = $data->role;

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (username, password, nama_lengkap, email, role) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $username, $hashed_password, $nama, $email, $role);

if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'Pengguna baru berhasil ditambahkan.';
} else {
            http_response_code(500);
            $response['status'] = 'error';
            if ($conn->errno == 1062) {
                        $response['message'] = 'Username atau Email sudah digunakan.';
            } else {
                        $response['message'] = 'Gagal menyimpan: ' . $stmt->error;
            }
}

$stmt->close();
echo json_encode($response);
$conn->close();
