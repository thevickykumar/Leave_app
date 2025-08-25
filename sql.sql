CREATE DATABASE leavelite CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE leavelite;


-- Users
CREATE TABLE users (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(120) NOT NULL,
email VARCHAR(160) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
role ENUM('employee','manager') NOT NULL DEFAULT 'employee',
manager_id INT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_users_manager FOREIGN KEY (manager_id) REFERENCES users(id)
);


-- Leave balances by type (days remaining)
CREATE TABLE leave_balances (
id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT NOT NULL,
type ENUM('Vacation','Sick','Unpaid') NOT NULL,
balance DECIMAL(5,2) NOT NULL DEFAULT 0,
CONSTRAINT fk_lb_user FOREIGN KEY (user_id) REFERENCES users(id),
UNIQUE KEY uq_user_type (user_id, type)
);


-- Leave requests
CREATE TABLE leave_requests (
id INT PRIMARY KEY AUTO_INCREMENT,
employee_id INT NOT NULL,
type ENUM('Vacation','Sick','Unpaid') NOT NULL,
start_date DATE NOT NULL,
end_date DATE NOT NULL,
days INT NOT NULL,
reason TEXT,
status ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
manager_id INT NULL,
manager_comment VARCHAR(255) NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
decided_at TIMESTAMP NULL,
CONSTRAINT fk_lr_employee FOREIGN KEY (employee_id) REFERENCES users(id),
CONSTRAINT fk_lr_manager FOREIGN KEY (manager_id) REFERENCES users(id)
);


-- Helpful indexes
CREATE INDEX idx_lr_emp ON leave_requests(employee_id);
CREATE INDEX idx_lr_mgr ON leave_requests(manager_id);
CREATE INDEX idx_lr_status ON leave_requests(status);