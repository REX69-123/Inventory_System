
USE database_dashboard;

CREATE TABLE product_inventory(
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_inventory_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    expiry DATE,
    quantity INT DEFAULT 0
);


gjijgr