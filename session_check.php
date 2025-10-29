<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    echo json_encode([
        "logged_in" => true,
        "user_name" => $_SESSION['user_name'],
        "username" => $_SESSION['username'],
        "user_role" => $_SESSION['user_role']
    ]);
} else {
    echo json_encode(["logged_in" => false]);
}
?>