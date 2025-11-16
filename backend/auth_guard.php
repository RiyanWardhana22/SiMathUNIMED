<?php
include_once 'jwt_config.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            die();
}
$authUser = null;

try {
            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? null;
            if (!$authHeader) {
                        http_response_code(401);
                        echo json_encode(array("message" => "Akses ditolak. Token otentikasi tidak ada."));
                        die();
            }
            $tokenParts = explode(" ", $authHeader);
            if (count($tokenParts) < 2 || $tokenParts[0] != 'Bearer') {
                        http_response_code(401);
                        echo json_encode(array("message" => "Format token tidak valid. Gunakan 'Bearer [token]'."));
                        die();
            }
            $jwt = $tokenParts[1];
            $payload = JWT::decode($jwt, new Key(JWT_SECRET_KEY, JWT_ALGORITHM));
            $authUser = (array) $payload->data;
} catch (ExpiredException $e) {
            http_response_code(401);
            echo json_encode(array("message" => "Akses ditolak. Token sudah kadaluwarsa.", "error" => $e->getMessage()));
            die();
} catch (SignatureInvalidException $e) {
            http_response_code(401);
            echo json_encode(array("message" => "Akses ditolak. Token tidak valid (signature).", "error" => $e->getMessage()));
            die();
} catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array("message" => "Akses ditolak. Token tidak bisa divalidasi.", "error" => $e->getMessage()));
            die();
}
