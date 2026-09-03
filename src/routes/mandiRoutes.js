// Express Mandi Query & Filter Router
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const mandis = JSON.parse(fs.readFileSync(path.resolve('data/mandis.json'), 'utf8'));

router.get('/mandis', (req, res) => {
  const { district } = req.query;
  let results = [...mandis];
  if (district) {
    results = results.filter(m => m.district.toLowerCase() === district.toLowerCase());
  }
  res.json({ total: results.length, data: results });
});

module.exports = router;
