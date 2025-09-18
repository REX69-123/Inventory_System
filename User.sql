CREATE DATABASE Users;
USE Users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL
);

INSERT INTO users (Username, password)
VALUES ('Default User', 'user', '123');

