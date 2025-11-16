<?php
$password_plain = 'riyan2206';

$hashed_password = password_hash($password_plain, PASSWORD_DEFAULT);

echo "Password Plain: " . $password_plain . "<br>";
echo "Password Hash: " . $hashed_password;
