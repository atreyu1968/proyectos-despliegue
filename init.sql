-- Create database if not exists
CREATE DATABASE IF NOT EXISTS fpinnova;
USE fpinnova;

-- Enable UTF-8 support
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'coordinator', 'presenter', 'reviewer', 'guest') NOT NULL,
    center VARCHAR(255),
    department VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create default admin user (password: admin123)
INSERT INTO users (
    id,
    name,
    email,
    password_hash,
    role,
    center,
    department,
    active,
    created_at
) VALUES (
    'admin-001',
    'Administrador',
    'admin@fpinnova.es',
    'admin123:c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec',
    'admin',
    'Sistema',
    'Administración',
    true,
    CURRENT_TIMESTAMP
) ON DUPLICATE KEY UPDATE
    password_hash = VALUES(password_hash),
    active = true;