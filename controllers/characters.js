'use strict';

const express = require('express');
const axios = require('axios');
const router = express.Router();
const libMetadata = require('../lib/metadata');

const TITLE = 'Rick and Morty';
const DESCRIPTION = 'A PWA Starter Kit';

function getViewState(req) {
  const viewState = {};
  viewState.contentOnly = false || req.query.contentOnly;
  return viewState;
}

function getViewArguments(req, viewState, characters, tab) {
  return Object.assign(libMetadata.fromRequest(req), {
    title: TITLE,
    description: DESCRIPTION,
    characters,
    currentTab: req.path.substring(1, req.path.length) || tab,
    contentOnly: viewState.contentOnly,
  });
}

// List and render template view
async function list(req, res, next, species, tab) {
  const viewState = getViewState(req);
  try {
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/?species=${species}`,
    );

    const html = await render(
      res,
      'pages/characters/list.hbs',
      getViewArguments(req, viewState, response.data.results, tab),
    );
    res.send(html);
  } catch (error) {
    error.status = 500;
    next(error);
  }
}

// Controllers
router.get('/humans', (req, res, next) => {
  list(req, res, next, 'human', 'humans');
});

router.get('/aliens', (req, res, next) => {
  list(req, res, next, 'alien', 'aliens');
});

router.get('/poopybuttholes', (req, res, next) => {
  list(req, res, next, 'poopybutthole', 'poopybuttholes');
});

// Render as a promise
function render(res, view, options) {
  return new Promise((resolve, reject) => {
    res.render(view, options, (err, html) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(html);
    });
  });
}

// Log/Format Error on /characters/* route
router.use((err, req, res, next) => {
  err.response = err.message;
  console.error(err);
  next(err);
});

module.exports = router;
