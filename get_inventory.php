<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "database_dashboard";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, product_name, category, `date`, quantity FROM product_inventory";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $id   = trim((int)$row['id']);
        $name = trim(htmlspecialchars($row['product_name']));
        $cat  = trim(htmlspecialchars($row['category']));
        $date = trim(htmlspecialchars($row['date']));
        $qty  = trim((int)$row['quantity']);

        // compute status
        $expiry = strtotime($row['date']);
        $today  = strtotime(date("Y-m-d"));
        if ($expiry < $today) {
            $status = "Expired";
        } elseif ($expiry < strtotime("+7 days", $today)) {
            $status = "Soon";
        } else {
            $status = "Valid";
        }

        echo "<tr data-id='{$id}'>";
        echo "<td>{$name}</td>";
        echo "<td>{$cat}</td>";
        echo "<td>{$date}</td>";
        echo "<td>{$qty}</td>";
        echo "<td>{$status}</td>";
        echo "<td>
                <button 
                class='editBtn' 
                data-id='{$id}' 
                data-name='{$name}' 
                data-category='{$cat}' 
                data-expiry='{$date}' 
                data-qty='{$qty}'
                >✏️ Edit</button>
                <button class='deleteBtn' data-id='{$id}'>🗑️ Delete</button>
              </td>";
        echo "</tr>";
    }
} else {
    echo "<tr><td colspan='6'>No inventory found.</td></tr>";
}

$conn->close();