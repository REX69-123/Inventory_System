<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "database_dashboard";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("<tr><td colspan='7'>Connection failed: " . $conn->connect_error . "</td></tr>");
}

// Query to get all accounts
$sql = "SELECT account_id, account_name, username, `password`, email, user_role FROM account_list";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    // Loop through rows and output table rows
    while ($row = $result->fetch_assoc()) {
        $id = trim((int)$row['account_id']);
        $account_name = trim(htmlspecialchars($row['account_name']));
        $username = trim(htmlspecialchars($row['username']));
        $password = trim(htmlspecialchars($row['password']));
        $email = trim(htmlspecialchars($row['email']));
        $user_role = trim(htmlspecialchars($row['user_role']));

        echo "<td>{$id}</td>";
        echo "<td>{$account_name}</td>";
        echo "<td>{$username}</td>";
        echo "<td>{$password}</td>";
        echo "<td>{$email}</td>";
        echo "<td>{$user_role}</td>";
        echo "<td>
                <button class='editBtn' data-id='{$id}'>✏️ Edit</button>
                <button class='deleteBtn' data-id='{$id}'>🗑️ Delete</button>
              </td>";
        echo "</tr>";
    }
} else {
    echo "<tr><td colspan='7'>No accounts found.</td></tr>";
}

$conn->close();
?>