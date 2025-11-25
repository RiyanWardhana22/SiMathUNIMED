<?php
include 'auth_guard.php';
include 'db_config.php';

$response = array();
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $sql = "SELECT * FROM pengaduan ORDER BY tanggal_buat DESC";
            $result = $conn->query($sql);
            $response['status'] = 'success';
            $response['data'] = $result->fetch_all(MYSQLI_ASSOC);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"));
            if (isset($data->id) && isset($data->status)) {
                        $id = intval($data->id);
                        $status = $data->status;
                        $tanggapan = isset($data->tanggapan) ? $data->tanggapan : NULL;

                        $stmt = $conn->prepare("UPDATE pengaduan SET status = ?, tanggapan_admin = ? WHERE id_pengaduan = ?");
                        $stmt->bind_param("ssi", $status, $tanggapan, $id);

                        if ($stmt->execute()) {
                                    $response['status'] = 'success';
                                    $response['message'] = 'Tanggapan berhasil dikirim.';
                        } else {
                                    $response['status'] = 'error';
                                    $response['message'] = 'Gagal update.';
                        }
            }
}

echo json_encode($response);
$conn->close();
