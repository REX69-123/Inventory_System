<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "database_dashboard";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo "Database connection failed";
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_POST["id"])) {
        echo "Missing ID";
        exit;
    }

    $id = trim(intval($_POST["id"]));

    $sql = "DELETE FROM product_inventory WHERE id = $id";
    if ($conn->query($sql) === TRUE) {
        echo "success";
        
    } else {
        echo "Error deleting record: " . $conn->error;
    }
} else {
    echo "Invalid request method";
}

$conn->close();
?>
