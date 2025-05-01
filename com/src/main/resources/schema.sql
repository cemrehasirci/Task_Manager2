CREATE TABLE users (
                       id INT PRIMARY KEY,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(20) NOT NULL
);

CREATE TABLE tasks (
                       id INT PRIMARY KEY,
                       title VARCHAR(255) NOT NULL,
                       description VARCHAR(255),
                       status VARCHAR(20),
                       user_id BIGINT
);
