require('dotenv').config();
require('@google-cloud/trace-agent').start({
    plugins: { 'modofun': 'modofun-trace-agent-plugin' }
  });
require('@google-cloud/debug-agent').start();
var app = require('./app').default;

// export modofun app as function handler
exports.api = app;
