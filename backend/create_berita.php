<?php
include 'auth_guard.php';
include 'db_config.php';

$data = json_decode(file_get_contents("php://input"));
$response = array();
if (
   isset($data->judul) && !empty($data->judul) &&
   isset($data->isi_berita) && !empty($data->isi_berita) &&
   isset($data->kategori) && !empty($data->kategori)
) {
   $judul = $data->judul;
   $isi_berita = $data->isi_berita;
   $kategori = $data->kategori;
   $id_penulis = $authUser['id_user'];
   $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $judul)));
   $stmt = $conn->prepare(
      "INSERT INTO berita (judul, slug, isi_berita, kategori, id_penulis) 
         VALUES (?, ?, ?, ?, ?)"
   );
   $stmt->bind_param("ssssi", $judul, $slug, $isi_berita, $kategori, $id_penulis);
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
