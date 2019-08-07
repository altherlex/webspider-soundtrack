const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

const addColumns = () => {
  const queryText =
    `ALTER TABLE albums
    ADD COLUMN final_url_generated TEXT;
    ADD COLUMN downloaded BOOLEAN DEFAULT FALSE
    ADD COLUMN path VARCHAR(258);`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create Tables
 */
const createTables = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      albums(
        id UUID PRIMARY KEY,
        name text NOT NULL UNIQUE,
        post_url text NOT NULL,
        capa text,
        hotlink_url text,
        download_url text,
        final_url_generated text,
        downloaded BOOLEAN DEFAULT FALSE,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Drop Tables
 */
const dropTables = () => {
  const queryText = 'DROP TABLE IF EXISTS albums';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createTables,
  dropTables,
  addColumns
};

require('make-runnable');