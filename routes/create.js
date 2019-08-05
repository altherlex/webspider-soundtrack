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
  try {
    const list = await helper.getLatestAlbums();
    // Asyncronous
    list.forEach(async (album) => {
      var hotlink_url = '';
      try {
        hotlink_url = await helper.getHotlink(album.post_url);
      } catch(e){
        console.log('erro ocorrido:', e);
      }

      const values = [
        uuidv4(),
        album.name,
        album.post_url,
        info.capa,
        hotlink_url,
        info.download_url,
        moment(new Date())
      ];

      //DOC: Reject duplicates
      try {
        await pool.query(state, values);
      } catch(e) {

      };
    }); // forEach end

    // // Syncronous
    // list.forEach( (album) => {
    //   const info = helper.getAlbumInfo(album.post_url);
    // }); // forEach end

  } catch(e) {
    console.log('deu errro', e);
  }

  res.status(201).redirect('/');
});

module.exports = router;
