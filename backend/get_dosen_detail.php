<?php
include 'api_headers.php';
include 'db_config.php';

$response = array();
if (isset($_GET['id'])) {
            $id_dosen = intval($_GET['id']);
            $stmt = $conn->prepare("
        SELECT 
            d.*, 
            p.nama_prodi 
        FROM 
            dosen d 
        LEFT JOIN 
            program_studi p ON d.id_prodi = p.id_prodi 
        WHERE 
            d.id_dosen = ?
    ");
            $stmt->bind_param("i", $id_dosen);
            if ($stmt->execute()) {
                        $result = $stmt->get_result();
                        if ($result->num_rows > 0) {
                                    $response['status'] = 'success';
                                    $response['data'] = $result->fetch_assoc();
                        } else {
                                    $response['status'] = 'not_found';
                                    $response['message'] = 'Dosen dengan ID ' . $id_dosen . ' tidak ditemukan.';
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
