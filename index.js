const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express application
const app = express();
const port = 3000; // Port on which your server will run

// MySQL Connection Pool
const pool = mysql.createPool({
    host: '127.0.0.1', // MySQL host
    user: 'root', // MySQL username
    password: '3275', // MySQL password
    database: 'contactForm', // Database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware to parse JSON and urlencoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use CORS middleware
app.use(cors());

// Route to handle form submission
app.post('/submit-form', (req, res) => {
    // Log the request body to debug
    console.log('Request Body:', req.body);

    // Extract data from the request body
    const fullName = req.body.Name;
    const email = req.body.Email;
    const message = req.body.Message;

    // SQL query to insert data into the database
    const sql = `INSERT INTO contactFormTable (fullname, email, message) VALUES (?, ?, ?)`;
    const values = [fullName, email, message];

    // Execute the query using the MySQL connection pool
    pool.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error saving data to database');
            return;
        }
        console.log('Data inserted successfully:', result);
        res.status(200).send('Data saved to database');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});