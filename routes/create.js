const state = `INSERT INTO 
  albums (
    id,
    name,
    post_url,
    capa,
    hotlink_url,
    download_url,
    created_date
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)`;
const express = require('express');
const router = express.Router();
const moment = require('moment');
const uuidv4 = require('uuidv4');
const { helper } = require('../lib/helper');

const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

/* GET users listing. */
router.post('/', async function(req, res, next) {
  // res.send('respond with a resource');

  try {
    const list = await helper.GetLatestAlbums();
    list.forEach(async (album) => {
      const values = [
        uuidv4(),
        album.name,
        album.link,
        'muito_loko_capa_url.jpg',
        'muito_loko_hotlink_url',
        'muito_loko_download_url',
        moment(new Date())
      ];
      await pool.query(state, values);
    }); // forEach end
  } catch(e) {
    console.log('deu errro', e);
  }


  res.status(201).redirect('/albums');
});

module.exports = router;
