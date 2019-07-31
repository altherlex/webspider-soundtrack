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

      const info = await helper.GetAlbumDownloadInfo(album.post_url);

      const values = [
        uuidv4(),
        album.name,
        album.post_url,
        info.capa,
        'muito_loko_hotlink_url',
        info.download_url,
        moment(new Date())
      ];

      //DOC: Valiade uniqueness
      try {
        await pool.query(state, values);
      } catch(e) {

      };
      
    }); // forEach end
  } catch(e) {
    console.log('deu errro', e);
  }


  res.status(201).redirect('/');
});

module.exports = router;
