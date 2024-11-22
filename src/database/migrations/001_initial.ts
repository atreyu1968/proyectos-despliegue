import { query } from '../connection';

export async function up() {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'coordinator', 'presenter', 'reviewer', 'guest') NOT NULL,
        center VARCHAR(255),
        department VARCHAR(255),
        active BOOLEAN DEFAULT true,
        two_factor_enabled BOOLEAN DEFAULT false,
        two_factor_secret VARCHAR(255),
        recovery_code VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        INDEX idx_users_email (email),
        INDEX idx_users_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create settings table
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        id VARCHAR(36) PRIMARY KEY,
        \`key\` VARCHAR(255) NOT NULL,
        value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_key (\`key\`),
        INDEX idx_settings_key (\`key\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create verification_codes table
    await query(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id VARCHAR(36) PRIMARY KEY,
        code VARCHAR(255) NOT NULL UNIQUE,
        type ENUM('admin', 'coordinator', 'presenter', 'reviewer', 'guest') NOT NULL,
        status ENUM('active', 'used', 'expired', 'revoked') NOT NULL DEFAULT 'active',
        max_uses INT NOT NULL DEFAULT 1,
        current_uses INT NOT NULL DEFAULT 0,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_verification_codes_code (code),
        INDEX idx_verification_codes_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Initial migration completed successfully');
  } catch (err) {
    console.error('Error during initial migration:', err);
    throw err;
  }
}

export async function down() {
  try {
    await query('DROP TABLE IF EXISTS verification_codes;');
    await query('DROP TABLE IF EXISTS settings;');
    await query('DROP TABLE IF EXISTS users;');
    console.log('Rollback completed successfully');
  } catch (err) {
    console.error('Error during rollback:', err);
    throw err;
  }
}