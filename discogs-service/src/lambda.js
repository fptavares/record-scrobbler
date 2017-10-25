require('dotenv').config();
var app = require('./app').default;

// pass modofun app as function handler
exports.handler = app;
