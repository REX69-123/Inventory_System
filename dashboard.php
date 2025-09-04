<?php


$servername = "localhost"; 
$username = "root";        
$password = "";            
$dbname = "database_dashboard"; // Replace with your database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn) {

    echo"Connection True" ;

} 
    
if (isset($_POST['submit']))  {

    $id = NULL ;
    $product_name = $_POST['product_name'];
    $category = $_POST['category'];
    $date = $_POST['date'];
    $quantity = $_POST['quantity'];

    if(empty($product_name && $category && $date && $quantity)) {
        
        echo"Empty field" ;

    } else {

    $sql = "INSERT INTO product_inventory (id, product_name, category, `date`, quantity) 
            VALUES ('$id', '$product_name', '$category', '$date', '$quantity')";

    if($conn->query($sql) === TRUE) {

        echo"Data Transferred Successfully" ;
        print_r($_POST);

    } else {

        echo"Data Transferred Unsuccessfully" ;
    }

    }

    } else {

    echo"No data found!!!";

    }



$conn->close();


?>