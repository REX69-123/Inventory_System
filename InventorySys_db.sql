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

CREATE TABLE account_list (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    account_name VARCHAR(100),
    username VARCHAR(100),
    email VARCHAR(100),
    user_role VARCHAR(100)
);
