import 'dotenv/config';
require('@google-cloud/trace-agent').start();
import '@google/cloud-debug';
import app from './app';

// pass express app as function handler
exports.discogsService = app;
