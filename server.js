const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // database

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const app = express();
app.use(bodyParser.json());


// Create User API
app.post('/users', (req, res) => {
  const { name, email, mobile_number } = req.body;
  const query = 'INSERT INTO users (name, email, mobile_number) VALUES (?, ?, ?)';
  db.query(query, [name, email, mobile_number], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User created successfully!' });
  });
});

// Add Expense API
app.post('/expenses', (req, res) => {
  const { total_amount, split_method, created_by } = req.body;
  const query = 'INSERT INTO expenses (total_amount, split_method, created_by) VALUES (?, ?, ?)';
  db.query(query, [total_amount, split_method, created_by], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Expense added successfully!' });
  });
});

// Get All Expenses API
app.get('/expenses', (req, res) => {
  const query = 'SELECT * FROM expenses';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});



// Balance Sheet Endpoint
app.get('/expenses/download', async (req, res) => {
  try {
    // Query expenses and participants from the database
    const [expenses] = await db.promise().query(`
      SELECT e.id, e.total_amount, e.split_method, e.created_at, 
             u.name AS user_name, ep.amount_owed
      FROM expenses e
      JOIN expense_participants ep ON e.id = ep.expense_id
      JOIN users u ON ep.user_id = u.id;
    `);

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Balance Sheet');

    // Add headers to the worksheet
    worksheet.columns = [
      { header: 'Expense ID', key: 'id', width: 15 },
      { header: 'User', key: 'user_name', width: 20 },
      { header: 'Amount Owed', key: 'amount_owed', width: 15 },
      { header: 'Total Amount', key: 'total_amount', width: 15 },
      { header: 'Split Method', key: 'split_method', width: 15 },
      { header: 'Date', key: 'created_at', width: 20 }
    ];

    // Add rows from the expense data
    expenses.forEach(expense => worksheet.addRow(expense));

    // Generate Excel file path
    const filePath = path.join(__dirname, 'balance-sheet.xlsx');

    // Save the workbook to the file system
    await workbook.xlsx.writeFile(filePath);

    // Send the file for download
    res.download(filePath, 'balance-sheet.xlsx', (err) => {
      if (err) {
        console.error('Error downloading the file:', err);
        res.status(500).send('Failed to download the balance sheet');
      }

      // Optional: Delete the file after sending it
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Error generating balance sheet:', error);
    res.status(500).send('Error generating balance sheet');
  }
});



// PDF Balance Sheet Endpoint
app.get('/expenses/download-pdf', async (req, res) => {
  try {
    // Query expenses and participants from the database
    const [expenses] = await db.promise().query(`
      SELECT e.id, e.total_amount, e.split_method, e.created_at, 
             u.name AS user_name, ep.amount_owed
      FROM expenses e
      JOIN expense_participants ep ON e.id = ep.expense_id
      JOIN users u ON ep.user_id = u.id;
    `);

    // Create a new PDF document
    const doc = new PDFDocument();
    const filePath = 'balance-sheet.pdf';

    // Pipe PDF to a file
    doc.pipe(fs.createWriteStream(filePath));

    // Add title and headers
    doc.fontSize(18).text('Balance Sheet', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // Add table headers
    doc.fontSize(12).text('ID\tUser\tAmount Owed\tTotal\tSplit Method\tDate');
    doc.moveDown();

    // Add expense data
    expenses.forEach(expense => {
      doc.text(
        `${expense.id}\t${expense.user_name}\t${expense.amount_owed}\t${expense.total_amount}\t${expense.split_method}\t${expense.created_at}`
      );
      doc.moveDown();
    });

    // Finalize the PDF and close the stream
    doc.end();

    // Send the PDF for download
    res.download(filePath, 'balance-sheet.pdf', (err) => {
      if (err) {
        console.error('Error downloading the PDF:', err);
        res.status(500).send('Failed to download the PDF');
      }

      // Optional: Delete the PDF after sending
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});



// Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
