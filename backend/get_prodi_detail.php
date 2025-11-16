<?php
include 'api_headers.php';
include 'db_config.php';

$response = array();
if (isset($_GET['id'])) {
            $id_prodi = intval($_GET['id']);
            $stmt = $conn->prepare("SELECT * FROM program_studi WHERE id_prodi = ?");
            $stmt->bind_param("i", $id_prodi);
            if ($stmt->execute()) {
                        $result = $stmt->get_result();
                        if ($result->num_rows > 0) {
                                    $response['status'] = 'success';
                                    $response['data'] = $result->fetch_assoc();
                        } else {
                                    $response['status'] = 'not_found';
                                    $response['message'] = 'Program studi dengan ID ' . $id_prodi . ' tidak ditemukan.';
                        }
            } else {
                        $response['status'] = 'error';
                        $response['message'] = 'Eksekusi query gagal: ' . $stmt->error;
            }

            $stmt->close();
} else {
            $response['status'] = 'error';
            $response['message'] = 'Parameter "id" wajib diisi.';
}

echo json_encode($response);
$conn->close();
