const express = require('express');
const asset = require('../lib/asset-hashing').asset;
const router = express.Router(); // eslint-disable-line new-cap
const CSSPATH = asset.encode('/css/style.css');
const JSPATH = asset.encode('/js/main.js');

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html');

  /* eslint-disable quotes */
  res.setHeader(
    'content-security-policy',
    [
      `connect-src 'self' https://www.google-analytics.com https://web-performance-dot-pwa-directory.appspot.com https://fcm.googleapis.com`,
      `default-src 'self' https://accounts.google.com https://apis.google.com https://fcm.googleapis.com`,
      `script-src 'self' 'unsafe-eval' https://apis.google.com https://www.google-analytics.com https://www.gstatic.com`,
      `style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/ https://www.gstatic.com`,
      `font-src 'self' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/`,
      `img-src 'self' https://storage.googleapis.com https://www.google-analytics.com`,
    ].join('; '),
  );
  /* eslint-enable quotes */
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('x-dns-prefetch-control', 'off');
  res.setHeader('x-download-options', 'noopen');
  res.setHeader('x-frame-options', 'SAMEORIGIN');
  res.setHeader('x-xss-protection', '1; mode=block');

  // Set the preload header if a full render is being requested.
  if (!req.query.contentOnly && !req.originalUrl.startsWith('/.app/')) {
    res.setHeader(
      'Link',
      `<${CSSPATH}>; rel=preload; as=style, <${JSPATH}>; rel=preload; as=script`,
    );
  }
  next();
});

module.exports = router;
