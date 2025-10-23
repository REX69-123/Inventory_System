<?php
// Place this at the top of dashboard.php (before any HTML)
$servername = "localhost"; 
$username = "root";        
$password = "";            
$dbname = "database_dashboard";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo "<script>alert('Connection failed.');</script>";
    exit;
} else {
    echo "<script>alert('Connection succeeded.');</script>";
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $account_name = trim($_POST['account_name']);
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $email = trim($_POST['email']);
    $user_role = trim($_POST['user_role']);

    if (empty($account_name) || empty($username) || empty($password) || empty($email) || empty($user_role)) {
        echo "<script>alert('Please fill in all fields correctly.');</script>";
    } else {
        $sql = "INSERT INTO account_list (account_name, username, `password`, email, user_role) 
                VALUES ('$account_name', '$username', '$password', '$email', '$user_role')";

        if ($conn->query($sql) === TRUE) {
            echo "success";
        } else {
            echo "error: Failed to insert data: " . $conn->error;
        }

        exit;
    }
}