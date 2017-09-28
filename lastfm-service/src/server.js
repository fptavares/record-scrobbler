import 'dotenv/config';
import express from 'express';
import app from './app';
import config from './config';

const {
  PORT,
} = config;

const server = express();
server.use((req, res) => app(req, res));
server.listen(PORT, () => console.log(
  `Last.fm Service is now running on http://localhost:${PORT}`
));
