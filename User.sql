
USE database_dashboard;

CREATE TABLE account_list (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    account_name VARCHAR(100),
    username VARCHAR(100),
    password VARCHAR(100),
    email VARCHAR(100),
    user_role VARCHAR(100)
);

INSERT INTO account_list (account_name, username, `password`, email, user_role)
VALUES ('Tester', 'admin123', 'admin321', 'admin123@gmail.com', 'Admin');

