import mysql from 'mysql2/promise';
import { config } from '../config';

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: 'Z',
  multipleStatements: true
});

export async function query(sql: string, params: any[] = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return [rows];
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
}

export async function transaction<T>(callback: (connection: mysql.Connection) => Promise<T>): Promise<T> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Database connection established successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
    process.exit(1);
  });

export default pool;