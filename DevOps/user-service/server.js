const express = require('express');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'chandraprakash',
  password: process.env.DB_PASSWORD || 'cpsql2005$$',
  database: process.env.DB_NAME || 'userdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize the database
async function initDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);
  } finally {
    connection.release();
  }
}

initDatabase();

app.post('/users', async (req, res) => {
  const { username, password } = req.body;
  const id = uuidv4();
  try {
    await pool.query('INSERT INTO users (id, username, password) VALUES (?, ?, ?)', [id, username, password]);
    res.status(201).json({ id, username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).send('User not found');
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`User service listening at http://localhost:${port}`);
});
