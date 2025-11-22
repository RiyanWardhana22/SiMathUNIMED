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
            !isset($data->id_user) || !isset($data->username) ||
            !isset($data->nama_lengkap) || !isset($data->email) || !isset($data->role)
) {
            http_response_code(400);
            die(json_encode(['status' => 'error', 'message' => 'Data tidak lengkap.']));
}

$id_user = intval($data->id_user);
$username = $data->username;
$nama = $data->nama_lengkap;
$email = $data->email;
$role = $data->role;
$password = isset($data->password) ? $data->password : '';

$stmt_check = $conn->prepare("SELECT id_user FROM users WHERE (username = ? OR email = ?) AND id_user != ?");
$stmt_check->bind_param("ssi", $username, $email, $id_user);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
            http_response_code(400);
            die(json_encode(['status' => 'error', 'message' => 'Username atau Email sudah digunakan user lain.']));
}
$stmt_check->close();

if (!empty($password)) {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE users SET username=?, nama_lengkap=?, email=?, role=?, password=? WHERE id_user=?");
            $stmt->bind_param("sssssi", $username, $nama, $email, $role, $hashed_password, $id_user);
} else {
            $stmt = $conn->prepare("UPDATE users SET username=?, nama_lengkap=?, email=?, role=? WHERE id_user=?");
            $stmt->bind_param("ssssi", $username, $nama, $email, $role, $id_user);
}

if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'Data pengguna berhasil diperbarui.';
} else {
            http_response_code(500);
            $response['status'] = 'error';
            $response['message'] = 'Gagal update: ' . $stmt->error;
}

$stmt->close();
echo json_encode($response);
$conn->close();
