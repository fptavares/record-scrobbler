require('dotenv').config();
require('@google-cloud/trace-agent').start();
require('@google/cloud-debug').start();
var app = require('./app').default;

// pass custom app as function handler
exports.lastfmService = app
