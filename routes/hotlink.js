const express = require('express');
const router = express.Router();
const {helper} = require('../lib/helper');

router.post('/', function(req, res, next) {
  // try {
    const result = helper.updateHotlink();
    return res.status(200).json(result);
  // } catch(error) {
    // return res.status(400).send(error);
  // }
});

module.exports = router;
