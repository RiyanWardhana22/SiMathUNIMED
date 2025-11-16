<?php
require_once __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

define('JWT_SECRET_KEY', 'SiMathUNIMED!@#');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRATION_TIME', 3600);
