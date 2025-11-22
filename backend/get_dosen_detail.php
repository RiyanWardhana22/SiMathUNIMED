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
        if (isset($response['data'])) {
            $dosen_data = $response['data'];
            $id = $dosen_data['id_dosen'];

            $stmt_pend = $conn->prepare("SELECT * FROM dosen_pendidikan WHERE id_dosen = ? ORDER BY tahun_lulus ASC");
            $stmt_pend->bind_param("i", $id);
            $stmt_pend->execute();
            $res_pend = $stmt_pend->get_result();

            $response['data']['pendidikan'] = $res_pend->fetch_all(MYSQLI_ASSOC);
            $stmt_pend->close();
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
