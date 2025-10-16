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
    $product_name = trim($_POST['product_name']);
    $category = trim($_POST['category']);
    $date = $_POST['date'];
    $quantity = intval($_POST['quantity']);

    if (empty($product_name) || empty($category) || empty($date) || $quantity < 0) {
        echo "<script>alert('Please fill in all fields correctly.');</script>";
    } else {
        $sql = "INSERT INTO product_inventory (product_name, category, `date`, quantity) 
                VALUES ('$product_name', '$category', '$date', $quantity)";

        if ($conn->query($sql) === TRUE) {
            echo "success";
        } else {
            echo "error: Failed to insert data: " . $conn->error;
        }

        exit;
    }
}