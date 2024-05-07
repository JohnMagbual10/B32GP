const pg = require('pg')
const express = require('express')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_notes_db')
const app = express()

// Define the async init function
const init = async () => {
    try {
      // Connect to the database
      await client.connect();
      console.log('Connected to the database');
  
      // Placeholder SQL query
      let SQL = `  DROP TABLE IF EXISTS notes;
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
      SQL = 
      ` INSERT INTO notes (txt, ranking) VALUES
      ('Note 1', 3),
      ('Note 2', 4),
      ('Note 3', 5);`;

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