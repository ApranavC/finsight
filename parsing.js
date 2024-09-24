const fs = require('fs');
const csvParser = require('csv-parser'); // Install this if needed

// Function to parse CSV and insert data into the database
function parseAndInsertCSV(filePath) {
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      const { date, amount, category, receiver } = row;
      db.run(
        `INSERT INTO transactions (date, amount, category, receiver) VALUES (?, ?, ?, ?)`,
        [date, amount, category, receiver]
      );
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

// Update the /upload endpoint
app.post('/upload', upload.single('bankStatement'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  parseAndInsertCSV(filePath);
  res.send('File uploaded and processed!');
});
