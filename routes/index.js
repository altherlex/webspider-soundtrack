const express = require('express');
const router = express.Router();

const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const { rows, rowCount } = await pool.query('SELECT * FROM albums ORDER BY id ASC');
    // return res.status(200).send({ rows, total: rowCount });
    return res.status(200).render('index', { rows, rowCount });
  } catch(error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
