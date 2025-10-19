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
    $id = trim(intval($_POST["id"]));
    $name = trim($_POST["product_name"]);
    $category = trim($_POST["category"]);
    $date = trim($_POST["date"]);
    $quantity = trim(intval($_POST["quantity"]));



    $stmt = $conn->prepare("UPDATE product_inventory SET product_name=?, category=?, date=?, quantity=? WHERE id=?");
    $stmt->bind_param("sssii", $name, $category, $date, $quantity, $id);

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "Error updating record";
    }

    $stmt->close();
} else {
    echo "Invalid request method";
}

$conn->close();
?>