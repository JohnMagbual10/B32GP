const pg = require('pg');
const express = require('express');
const app = express();

// Define the pg client
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_notes_db');

// Define the async init function
const init = async () => {
    try {
        // Connect to the database
        await client.connect();
        console.log('Connected to the database');

        // Placeholder SQL query
        let SQL = `
            DROP TABLE IF EXISTS notes;
            CREATE TABLE IF NOT EXISTS notes (
                id SERIAL PRIMARY KEY,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                ranking INTEGER DEFAULT 3 NOT NULL,
                txt VARCHAR(255) NOT NULL
            );
        `;

        // Run the SQL query to create tables
        await client.query(SQL);
        console.log('Tables created');

        // Run the SQL query to seed data
        SQL = `
            INSERT INTO notes (txt, ranking) VALUES
            ('Note 1', 3),
            ('Note 2', 4),
            ('Note 3', 5);
        `;

        await client.query(SQL);
        console.log('Data seeded');

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        // Close the client connection
        await client.end();
        console.log('Connection closed');
    }
};

// Invoke the init function
init();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware for logging requests
app.use(require('morgan')('dev'));

// Routes for CRUD operations
// CREATE
app.post('/api/notes', async (req, res, next) => {
    try {
        // SQL query for insertion
        const SQL = `
            INSERT INTO notes (txt) VALUES ($1) RETURNING *;
        `;

        // Execute the query with request body's txt value
        const response = await client.query(SQL, [req.body.txt]);

        // Send back the inserted row
        res.send(response.rows[0]);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// READ
app.get('/api/notes', async (req, res, next) => {
    try {
        // Query to retrieve notes
        const SQL = `SELECT * FROM notes ORDER BY created_at DESC`;

        // Execute the query
        const response = await client.query(SQL);

        // Send the response
        res.send(response.rows);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// UPDATE
app.put('/api/notes/:id', async (req, res, next) => {
    try {
        // Your UPDATE operation logic here
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE
app.delete('/api/notes/:id', async (req, res, next) => {
    try {
        // Your DELETE operation logic here
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Define the port
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// CURL Commands for testing routes
/*
To test the CREATE route:
curl localhost:3000/api/notes -X POST -d '{"txt": "xyz", "ranking": 4}' -H "Content-Type:application/json"

To test the READ route:
curl localhost:3000/api/notes

To test the UPDATE route:
curl localhost:3000/api/notes/2 -X PUT -d '{"txt": "abc", "ranking": 1}' -H "Content-Type:application/json"

To test the DELETE route:
curl localhost:3000/api/notes/1 -X DELETE
*/
