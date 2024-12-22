  

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const db = new sqlite3.Database('./books.db');


// Create a Users table
db.serialize(() => {
  db.run('CREATE TABLE books ( id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, author TEXT NOT NULL, content TEXT )');
});
// Endpoint to create a new book
app.post('/api/books', (req, res) => {
  const { title, author, content } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }

  const query = `INSERT INTO books (title, author, content) VALUES (?, ?, ?)`;
  db.run(query, [title, author, content], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Book created successfully' });
  });
});

// Endpoint to search books
app.get('/api/books/search', (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const sql = `SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR content LIKE ?`;
  const params = [`%${query}%`, `%${query}%`, `%${query}%`];

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(3002, () => {
  console.log('API server running on port 3002');
});

