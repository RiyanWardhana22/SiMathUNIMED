<?php
include 'auth_guard.php';
include 'db_config.php';

$response = array();
if (
            isset($_POST['id']) && !empty($_POST['id']) &&
            isset($_POST['judul']) && !empty($_POST['judul']) &&
            isset($_POST['isi_berita']) &&
            isset($_POST['kategori']) && !empty($_POST['kategori'])
) {
            $role = $authUser['role'];
            if ($role == 'superadmin' || $role == 'admin_jurusan') {

                        $id_berita = intval($_POST['id']);
                        $judul = $_POST['judul'];
                        $isi_berita = $_POST['isi_berita'];
                        $kategori = $_POST['kategori'];
                        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $judul)));
                        $gambar_header = null;
                        if (isset($_FILES['gambar_header']) && $_FILES['gambar_header']['error'] == UPLOAD_ERR_OK) {
                                    $file = $_FILES['gambar_header'];
                                    $file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                                    $allowed_ext = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

                                    if (in_array($file_ext, $allowed_ext)) {
                                                $gambar_header = 'berita-' . $id_berita . '-' . time() . '.' . $file_ext;
                                                $target_dir = __DIR__ . '/../uploads/images/';
                                                $target_file = $target_dir . $gambar_header;

                                                if (!move_uploaded_file($file['tmp_name'], $target_file)) {
                                                            http_response_code(500);
                                                            $response['status'] = 'error';
                                                            $response['message'] = 'Gagal memindahkan file gambar.';
                                                            echo json_encode($response);
                                                            die();
                                                }
                                    } else {
                                                http_response_code(400);
                                                $response['status'] = 'error';
                                                $response['message'] = 'Format file tidak valid.';
                                                echo json_encode($response);
                                                die();
                                    }
                        }
                        $sql = "UPDATE berita SET judul = ?, slug = ?, isi_berita = ?, kategori = ?";
                        $params_types = "ssss";
                        $params_values = [$judul, $slug, $isi_berita, $kategori];

                        if ($gambar_header !== null) {
                                    $sql .= ", gambar_header = ?";
                                    $params_types .= "s";
                                    $params_values[] = $gambar_header;
                        }

                        $sql .= " WHERE id_berita = ?";
                        $params_types .= "i";
                        $params_values[] = $id_berita;

                        $stmt = $conn->prepare($sql);
                        $stmt->bind_param($params_types, ...$params_values);

                        if ($stmt->execute()) {
                                    $response['status'] = 'success';
                                    $response['message'] = 'Postingan berhasil diperbarui.';
                        } else {
                                    http_response_code(500);
                                    $response['status'] = 'error';
                                    $response['message'] = 'Gagal memperbarui database: ' . $stmt->error;
                        }

                        $stmt->close();
            } else {
                        http_response_code(403);
                        $response['status'] = 'error';
                        $response['message'] = 'Akses ditolak. Anda tidak memiliki izin.';
            }
} else {
            http_response_code(400);
            $response['status'] = 'error';
            $response['message'] = 'Input tidak lengkap.';
}

echo json_encode($response);
$conn->close();
