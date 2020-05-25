'use strict';

const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const bodyParser = require('body-parser');

router.use(bodyParser.json());

// API
// router.use('/api', require('./api'));

// Tasks
// router.use('/tasks', require('./tasks'));

// About
router.use('/about', require('./about'));

// Videos
router.use('/videos', require('./videos'));

router.get('/', (req, res) => {
  req.url = '/videos';
  router.handle(req, res);
});

router.get('/installable', (req, res) => {
  req.url = '/pwas/installable';
  router.handle(req, res);
});

// ServiceWorker
router.use('/js', require('./sw'));

// /.shell hosts app shell dependencies
router.use('/.app', require('./app'));

module.exports = router;
