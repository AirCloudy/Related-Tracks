require('newrelic');
const express = require('express');
const db = require('../database/methods.js');
const path = require('path');

let app = express();

const PORT = 5000;

app.use(express.json());

app.use('/:songid', express.static(path.join(__dirname, '../public/dist')));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4000'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/:songid', (req, res) => {
  console.log('Processing get request');
  var song_id = parseInt(req.params.songid);
  db.getSong(song_id, res);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
