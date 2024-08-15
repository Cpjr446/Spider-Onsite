const express = require('express');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');
const app = express();
const port = 3001;

app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'chandraprakash',
  password: process.env.DB_PASSWORD || 'cpsql2005$$',
  database: process.env.DB_NAME || 'productdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `);
  } finally {
    connection.release();
  }
}

initDatabase();

app.post('/products', async (req, res) => {
  const { name, price } = req.body;
  const id = uuidv4();
  try {
    await pool.query('INSERT INTO products (id, name, price) VALUES (?, ?, ?)', [id, name, price]);
    res.status(201).json({ id, name, price });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Product service listening at http://localhost:${port}`);
});
