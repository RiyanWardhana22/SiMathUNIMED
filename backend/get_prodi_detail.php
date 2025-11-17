<?php
include 'api_headers.php';
include 'db_config.php';

$response = array();
$response['data'] = array();
if (isset($_GET['id'])) {
            $id_prodi = intval($_GET['id']);
            $stmt_prodi = $conn->prepare("SELECT * FROM program_studi WHERE id_prodi = ?");
            $stmt_prodi->bind_param("i", $id_prodi);
            if ($stmt_prodi->execute()) {
                        $result_prodi = $stmt_prodi->get_result();
                        if ($result_prodi->num_rows > 0) {
                                    $response['status'] = 'success';
                                    $response['data']['profil'] = $result_prodi->fetch_assoc();
                        } else {
                                    http_response_code(404);
                                    $response['status'] = 'not_found';
                                    $response['message'] = 'Program studi dengan ID ' . $id_prodi . ' tidak ditemukan.';
                                    echo json_encode($response);
                                    die();
                        }
            } else {
                        http_response_code(500);
                        $response['status'] = 'error';
                        $response['message'] = 'Query profil prodi gagal: ' . $stmt_prodi->error;
                        echo json_encode($response);
                        die();
            }
            $stmt_prodi->close();
            $stmt_dosen = $conn->prepare(
                        "SELECT id_dosen, nama_dosen, foto_profil, bidang_keahlian 
         FROM dosen WHERE id_prodi = ? 
         ORDER BY nama_dosen"
            );
            $stmt_dosen->bind_param("i", $id_prodi);
            if ($stmt_dosen->execute()) {
                        $result_dosen = $stmt_dosen->get_result();
                        $response['data']['dosen'] = $result_dosen->fetch_all(MYSQLI_ASSOC);
            } else {
                        $response['data']['dosen'] = [];
            }
            $stmt_dosen->close();
            $stmt_dokumen = $conn->prepare(
                        "SELECT id_dokumen, nama_dokumen, file_path, kategori 
         FROM dokumen WHERE id_prodi = ? 
         ORDER BY kategori, nama_dokumen"
            );
            $stmt_dokumen->bind_param("i", $id_prodi);
            if ($stmt_dokumen->execute()) {
                        $result_dokumen = $stmt_dokumen->get_result();
                        $response['data']['dokumen'] = $result_dokumen->fetch_all(MYSQLI_ASSOC);
            } else {
                        $response['data']['dokumen'] = [];
            }
            $stmt_dokumen->close();
} else {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Parameter "id" wajib diisi.';
}

echo json_encode($response);
$conn->close();
