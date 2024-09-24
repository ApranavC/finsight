const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// Middleware to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Set up the SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      amount REAL,
      category TEXT,
      receiver TEXT
    )
  `);
});

// Route to serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// File upload endpoint
app.post('/upload', upload.single('bankStatement'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  parseAndInsertCSV(filePath); // Parse CSV and insert data into DB
  res.send('File uploaded and processed!');
});

// Function to parse CSV and insert into the database (placeholder)
function parseAndInsertCSV(filePath) {
  // CSV parsing and database insertion logic
  console.log('Parsing and inserting CSV from', filePath);
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
