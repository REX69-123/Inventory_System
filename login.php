<?php
session_start();

$servername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbname = "database_dashboard";

$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);
$usernameInput = trim($data['username'] ?? '');
$passwordInput = trim($data['password'] ?? '');

if ($usernameInput === "" || $passwordInput === "") {
    echo json_encode(["success" => false, "message" => "Please fill in all fields."]);
    exit;
}

$sql = "SELECT account_id, account_name, username, password, user_role 
        FROM account_list WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $usernameInput);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if ($passwordInput === $row['password']) {  // ⚠️ Plain text, can be hashed later
        $_SESSION['user_id'] = $row['account_id'];
        $_SESSION['user_name'] = $row['account_name'];
        $_SESSION['username'] = $row['username'];
        $_SESSION['user_role'] = $row['user_role'];
        $_SESSION['logged_in'] = true;

        echo json_encode(["success" => true, "user_name" => $row['account_name']]);
    } else {
        echo json_encode(["success" => false, "message" => "Incorrect password."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Username not found."]);
}

$conn->close();
?>