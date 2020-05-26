'use strict';

const express = require('express');
const router = express.Router();
const libMetadata = require('../lib/metadata');

const DEFAULT_TAB = 'home';
const TITLE = 'Rick and Morty';
const DESCRIPTION = 'A PWA Starter Kit';

/**
 * Setup the list template view state
 */
function getViewState(req) {
  const viewState = {};
  viewState.contentOnly = false || req.query.contentOnly;
  return viewState;
}

/**
 * Setup the list template view arguments
 */
function getViewArguments(req, viewState) {
  return Object.assign(libMetadata.fromRequest(req), {
    title: TITLE,
    description: DESCRIPTION,
    currentTab: DEFAULT_TAB,
    contentOnly: viewState.contentOnly,
  });
}

// Render template view
async function home(req, res) {
  const viewState = getViewState(req);
  const html = await render(
    res,
    'pages/home/view.hbs',
    getViewArguments(req, viewState),
  );
  res.send(html);
}

// Controllers
router.get('/', (req, res, next) => {
  home(req, res, next);
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
