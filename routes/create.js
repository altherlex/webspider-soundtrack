const state = `INSERT INTO 
  albums (
    id,
    name,
    post_url,
    capa,
    download_url,
    created_date
  )
  VALUES ($1, $2, $3, $4, $5, $6)`;
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
  try {
    const list = await helper.getLatestAlbums();

    // Asyncronous
    list.forEach(async (album) => {
      const info = await helper.getAlbumInfo(album.post_url);
      const values = [
        uuidv4(),
        album.name,
        album.post_url,
        info.capa,
        info.download_url,
        moment(new Date())
      ];
      //DOC: Reject duplicates
      try {
        await pool.query(state, values);
      } catch(e) {
      };
    }); // forEach end
    return res.status(201).redirect('/albums?format=json');
  } catch(e) {
    console.log('deu errro', e);
  }
});

module.exports = router;
