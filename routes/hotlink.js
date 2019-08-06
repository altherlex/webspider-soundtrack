const express = require('express');
const router = express.Router();
const {helper} = require('../lib/helper');

router.post('/', async function(req, res, next) {
  try {
    const result = await helper.updateInfo();
    // return res.status(201).redirect('/albums?format=json');
    return res.status(200).json({ total: result.length, rows: result });
  } catch(error) {
    console.log('Error', error);
    return res.status(400).json({ error: 'Error'});
  }
});

module.exports = router;
