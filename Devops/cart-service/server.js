const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3002;

app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'chandraprakash',
  password: process.env.DB_PASSWORD || 'cpsql2005$$',
  database: process.env.DB_NAME || 'myapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
async function initDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        quantity INT NOT NULL,
        UNIQUE KEY user_product (user_id, product_id)
      )
    `);
  } finally {
    connection.release();
  }
}

initDatabase();

app.post('/cart/:userId/add', async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;
  try {
    await pool.query(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)',
      [userId, productId, quantity]
    );
    const [rows] = await pool.query('SELECT * FROM cart_items WHERE user_id = ?', [userId]);
    res.status(201).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM cart_items WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Cart service listening at http://localhost:${port}`);
});
