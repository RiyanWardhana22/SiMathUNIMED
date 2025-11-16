<?php
include 'api_headers.php';
include 'db_config.php';

$response = array();
if (isset($_GET['slug'])) {
            $slug = $_GET['slug'];
            $stmt = $conn->prepare("
        SELECT 
            b.*, 
            u.nama_lengkap AS nama_penulis 
        FROM 
            berita b 
        LEFT JOIN 
            users u ON b.id_penulis = u.id_user 
        WHERE 
            b.slug = ?
    ");
            $stmt->bind_param("s", $slug);
            if ($stmt->execute()) {
                        $result = $stmt->get_result();
                        if ($result->num_rows > 0) {
                                    $response['status'] = 'success';
                                    $response['data'] = $result->fetch_assoc();
                        } else {
                                    $response['status'] = 'not_found';
                                    $response['message'] = 'Postingan dengan slug "' . $slug . '" tidak ditemukan.';
                        }
            } else {
                        $response['status'] = 'error';
                        $response['message'] = 'Eksekusi query gagal: ' . $stmt->error;
            }

            $stmt->close();
} else {
            $response['status'] = 'error';
            $response['message'] = 'Parameter "slug" wajib diisi.';
}

echo json_encode($response);
$conn->close();
