const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' directory

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'chore_chart_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});

// API endpoints for chores
app.get('/api/chores', (req, res) => {
  db.query('SELECT * FROM chores', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/api/chores', (req, res) => {
  const { name, points } = req.body;
  db.query('INSERT INTO chores (name, points) VALUES (?, ?)', [name, points], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, name, points });
  });
});

app.put('/api/chores/:id', (req, res) => {
  const { id } = req.params;
  const { name, points } = req.body;
  db.query('UPDATE chores SET name = ?, points = ? WHERE id = ?', [name, points, id], (err) => {
    if (err) throw err;
    res.json({ id, name, points });
  });
});

app.delete('/api/chores/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM chores WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'Chore deleted successfully' });
  });
});

// API endpoints for bonus points
app.get('/api/bonus', (req, res) => {
  db.query('SELECT * FROM bonus_points', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/api/bonus', (req, res) => {
  const { note, points, timestamp } = req.body;
  db.query('INSERT INTO bonus_points (note, points, timestamp) VALUES (?, ?, ?)', [note, points, timestamp], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, note, points, timestamp });
  });
});

// API endpoints for store items
app.get('/api/store', (req, res) => {
  db.query('SELECT * FROM store_items', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/api/store', (req, res) => {
  const { name, cost } = req.body;
  db.query('INSERT INTO store_items (name, cost) VALUES (?, ?)', [name, cost], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, name, cost });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));