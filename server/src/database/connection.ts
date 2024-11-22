import mariadb from 'mariadb';
import { config } from '../config';

const pool = mariadb.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  connectionLimit: 10,
  charset: 'utf8mb4',
  timezone: 'Z',
  multipleStatements: true
});

export async function query(sql: string, params: any[] = []) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql, params);
    return [rows];
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function transaction<T>(callback: (connection: mariadb.Connection) => Promise<T>): Promise<T> {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    if (conn) await conn.rollback();
    throw err;
  } finally {
    if (conn) conn.release();
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