const insert = `INSERT INTO 
  albums (
    id,
    name,
    post_url,
    capa,
    download_url,
    created_date
  )
  VALUES ($1, $2, $3, $4, $5, $6)`;
const update = `UPDATE albums SET capa=$2, download_url=$3, modified_date=$4 WHERE ID=$1`;
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
    const new_list = await helper.getLatestAlbums();
    const stmt = await pool.query('SELECT id, post_url FROM albums WHERE download_url IS NULL');
    const list = new_list.concat(stmt.rows);

    // Asyncronous
    await list.forEach(async (album) => {
      const info = await helper.getAlbumInfo(album.post_url);

      if (album.id !== null) { //update
        await pool.query(update, [album.id, info.capa, info.download_url, moment(new Date())]);
      } else { //insert
        try { //DOC: Reject duplicates
          const values = [
            uuidv4(),
            album.name,
            album.post_url,
            info.capa,
            info.download_url,
            moment(new Date())
          ];
          await pool.query(insert, values);
        } catch(e) {};
      }
    }); // forEach end

    return res.status(201).redirect('/albums?format=json');
  } catch(e) {
    console.log('deu errro', e);
    return res.status(400).send(e);
  }
});

module.exports = router;
