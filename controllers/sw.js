'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const asset = require('../lib/asset-hashing').asset;

const ASSETS = JSON.stringify(
  ['/css/style.css', '/js/main.js'].map((assetPath) => ({
    url: asset.encode(assetPath),
  })),
);

const ASSETS_JS = `const ASSETS = ${ASSETS};`;

router.get('/sw-assets-precache.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'no-cache, max-age=0');
  res.send(ASSETS_JS);
});

module.exports = router;
