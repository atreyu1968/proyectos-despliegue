export const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'fpinnova',
    password: process.env.DB_PASSWORD || 'fpinnova_secure_pass',
    name: process.env.DB_NAME || 'fpinnova',
  },
  api: {
    port: Number(process.env.PORT) || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your_secure_jwt_secret_key_here',
  }
};