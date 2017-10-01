require('dotenv').config();
require('@google-cloud/trace-agent').start();
require('@google-cloud/debug-agent').start();
var app = require('./app').default;

// pass express app as function handler
exports.discogs = app;
