'use strict';

// Hierarchical node.js configuration with command-line arguments, environment
// variables, and files.
const nconf = require('nconf');
const path = require('path');

nconf
  // 1. Command-line arguments
  .argv()
  // 2. Environment variables
  .env([
    'CLOUD_BUCKET',
    'GCLOUD_PROJECT',
    'PORT',
    'CLIENT_ID',
    'CLIENT_SECRET',
    'WEBPERFORMANCE_SERVER',
    'WEBPERFORMANCE_SERVER_API_KEY',
    'GOOGLE_ANALYTICS',
    'FIREBASE_AUTH',
    'CANONICAL_ROOT',
    'FIREBASE_MSG_SENDER_ID',
    'API_TOKENS',
  ])
  // 3. Config file
  .file({ file: path.join(__dirname, 'config.json') })
  // 4. Defaults
  .defaults({
    PORT: 8081, // Port used by HTTP server
  });

// Check for required settings
// checkConfig('GCLOUD_PROJECT');
// checkConfig('CLOUD_BUCKET');
// checkConfig('CLIENT_ID');
// checkConfig('CLIENT_SECRET');

function checkConfig(setting) {
  // If setting undefined, throw error
  if (!nconf.get(setting)) {
    throw new Error(
      `You must set the ${setting} environment variable or add it to ` +
        'config/config.json!',
    );
  }
  // If setting includes a space, throw error
  if (nconf.get(setting).match(/\s/)) {
    throw new Error(
      `The ${setting} environment variable is suspicious ("${nconf.get(
        setting,
      )}")`,
    );
  }
}

module.exports = nconf;
