CREATE DATABASE InventorySys_db;
USE InventorySys_db;

CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    quantity INT DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id)
	REFERENCES items (id)
);
