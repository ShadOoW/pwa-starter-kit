'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

router.get('/shell', (req, res) => {
  res.render('app/shell.hbs');
});

router.get('/offline', (req, res, next) => {
  // eslint-disable-line no-unused-vars
  res.render('app/offline.hbs');
});

module.exports = router;
