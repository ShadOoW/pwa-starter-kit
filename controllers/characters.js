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

function getViewArguments(req, viewState, data, species) {
  return Object.assign(libMetadata.fromRequest(req), {
    title: TITLE,
    description: DESCRIPTION,
    data,
    currentTab: species,
    contentOnly: viewState.contentOnly,
  });
}

// List and render template view
async function list(req, res, next, species) {
  const viewState = getViewState(req);
  try {
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/?species=${species}`,
    );

    const html = await render(
      res,
      'pages/characters/list.hbs',
      getViewArguments(req, viewState, response.data.results, species),
    );
    res.send(html);
  } catch (error) {
    error.status = 500;
    next(error);
  }
}

// Get details and render template view
async function detail(req, res, next, species, id) {
  const viewState = getViewState(req);
  try {
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/${id}`,
    );

    const html = await render(
      res,
      'pages/characters/detail.hbs',
      getViewArguments(req, viewState, response.data, species),
    );
    res.send(html);
  } catch (error) {
    error.status = 500;
    next(error);
  }
}

// Controllers
router.get('/:species(human|alien|poopybutthole)/', (req, res, next) => {
  list(req, res, next, req.params.species);
});

router.get('/:species(human|alien|poopybutthole)/:id', (req, res, next) => {
  detail(req, res, next, req.params.species, req.params.id);
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
