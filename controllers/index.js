'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

// About
router.use('/', require('./home'));

// Videos
router.use('/characters', require('./characters'));

// ServiceWorker
router.use('/js', require('./sw'));

// /.shell hosts app shell dependencies
router.use('/.app', require('./app'));

module.exports = router;
