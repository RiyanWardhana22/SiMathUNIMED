<?php
include 'auth_guard.php';
include 'db_config.php';

$response = array();
if (
   isset($_POST['judul']) && !empty($_POST['judul']) &&
   isset($_POST['isi_berita']) && !empty($_POST['isi_berita']) &&
   isset($_POST['kategori']) && !empty($_POST['kategori'])
) {
   $judul = $_POST['judul'];
   $isi_berita = $_POST['isi_berita'];
   $kategori = $_POST['kategori'];
   $id_penulis = $authUser['id_user'];
   $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $judul)));
   $gambar_header = NULL;

   if (isset($_FILES['gambar_header']) && $_FILES['gambar_header']['error'] == UPLOAD_ERR_OK) {
      $file = $_FILES['gambar_header'];
      $file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
      $allowed_ext = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

      if (in_array($file_ext, $allowed_ext)) {
         $gambar_header = 'berita-' . time() . '.' . $file_ext;
         $target_dir = __DIR__ . '/../uploads/images/';
         $target_file = $target_dir . $gambar_header;

         if (!move_uploaded_file($file['tmp_name'], $target_file)) {
            http_response_code(500);
            $response['status'] = 'error';
            $response['message'] = 'Gagal mengupload gambar.';
            echo json_encode($response);
            die();
         }
      } else {
         http_response_code(400);
         $response['status'] = 'error';
         $response['message'] = 'Format gambar tidak valid.';
         echo json_encode($response);
         die();
      }
   }

   $stmt = $conn->prepare(
      "INSERT INTO berita (judul, slug, isi_berita, kategori, id_penulis, gambar_header) 
         VALUES (?, ?, ?, ?, ?, ?)"
   );
   $stmt->bind_param("ssssis", $judul, $slug, $isi_berita, $kategori, $id_penulis, $gambar_header);

   if ($stmt->execute()) {
      $response['status'] = 'success';
      $response['message'] = 'Berita baru berhasil ditambahkan.';
      $response['new_id'] = $conn->insert_id;
   } else {
      http_response_code(500);
      $response['status'] = 'error';
      $response['message'] = 'Gagal menyimpan ke database: ' . $stmt->error;
   }

   $stmt->close();
} else {
   http_response_code(400);
   $response['status'] = 'error';
   $response['message'] = 'Input tidak lengkap. Judul, isi, dan kategori wajib diisi.';
}

echo json_encode($response);
$conn->close();
