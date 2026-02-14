import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') }); // El .env en la carpeta raiz
dotenv.config({ path: path.resolve(__dirname, '..', '.env') }); // El .env en la carpeta backend

const dbConfig = {
  host: process.env.HOST || 'localhost',
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

function getPool() {
  return mysql.createPool(dbConfig);
}

const pool = getPool();

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function closePool() {
  await pool.end();
}

export default pool;
