CREATE DATABASE database_dashboard;
USE database_dashboard;
;

CREATE TABLE product_inventory(
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_inventory_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    expiry DATE,
    quantity INT DEFAULT 0,
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    type ENUM('ADD','REMOVE','EDIT','DELETE') DEFAULT 'ADD',
    FOREIGN KEY (item_id) REFERENCES items (id)
);

UPDATE items
SET name = ?,
    category = ?,
    expiry = ?, 
    quantity = ?,
    price = ?
WHERE id = ?;