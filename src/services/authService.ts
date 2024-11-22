import { v4 as uuidv4 } from 'uuid';
import { authenticator } from 'otplib';
import { query } from '../database/connection';
import { hashPassword, verifyPassword } from '../utils/auth';
import { User } from '../types/auth';

export async function login(email: string, password: string): Promise<{ user: User; requiresTwoFactor: boolean }> {
  const [users] = await query(
    'SELECT * FROM users WHERE email = ? AND active = true LIMIT 1',
    [email]
  );

  const user = users[0];
  if (!user || !verifyPassword(password, user.password_hash)) {
    throw new Error('Credenciales inválidas');
  }

  // Update last login
  await query(
    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
    [user.id]
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      center: user.center,
      department: user.department,
      twoFactorEnabled: user.two_factor_enabled,
      lastLogin: user.last_login
    },
    requiresTwoFactor: user.two_factor_enabled
  };
}

export async function setupTwoFactor(userId: string): Promise<{ secret: string; qrCode: string; recoveryCode: string } | null> {
  const [users] = await query(
    'SELECT * FROM users WHERE id = ? LIMIT 1',
    [userId]
  );

  const user = users[0];
  if (!user) return null;

  const secret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri(user.email, 'FP Innova', secret);
  const recoveryCode = generateRecoveryCode();

  await query(
    'UPDATE users SET two_factor_secret = ?, recovery_code = ? WHERE id = ?',
    [secret, recoveryCode, userId]
  );

  return {
    secret,
    qrCode: otpauthUrl,
    recoveryCode
  };
}

export async function verifyTwoFactorSetup(userId: string, code: string): Promise<boolean> {
  const [users] = await query(
    'SELECT * FROM users WHERE id = ? LIMIT 1',
    [userId]
  );

  const user = users[0];
  if (!user || !user.two_factor_secret) return false;

  const isValid = authenticator.verify({
    token: code,
    secret: user.two_factor_secret
  });

  if (isValid) {
    await query(
      'UPDATE users SET two_factor_enabled = true WHERE id = ?',
      [userId]
    );
  }

  return isValid;
}

export async function verifyTwoFactorLogin(userId: string, code: string): Promise<boolean> {
  const [users] = await query(
    'SELECT * FROM users WHERE id = ? LIMIT 1',
    [userId]
  );

  const user = users[0];
  if (!user || !user.two_factor_secret) return false;

  return authenticator.verify({
    token: code,
    secret: user.two_factor_secret
  });
}

export async function verifyRecoveryCode(userId: string, code: string): Promise<boolean> {
  const [users] = await query(
    'SELECT * FROM users WHERE id = ? LIMIT 1',
    [userId]
  );

  const user = users[0];
  if (!user || !user.recovery_code) return false;

  const isValid = user.recovery_code === code;

  if (isValid) {
    await query(
      'UPDATE users SET two_factor_enabled = false, two_factor_secret = NULL, recovery_code = NULL WHERE id = ?',
      [userId]
    );
  }

  return isValid;
}

export async function disableTwoFactor(userId: string, code: string): Promise<boolean> {
  const isValid = await verifyTwoFactorLogin(userId, code);
  
  if (isValid) {
    await query(
      'UPDATE users SET two_factor_enabled = false, two_factor_secret = NULL, recovery_code = NULL WHERE id = ?',
      [userId]
    );
  }

  return isValid;
}

function generateRecoveryCode(): string {
  return Array.from({ length: 4 }, () => 
    Math.random().toString(36).substring(2, 7)
  ).join('-').toUpperCase();
}