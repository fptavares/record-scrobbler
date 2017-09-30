import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import app from './app';
import { PORT } from './config';

const server = express();
// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
server.use(bodyParser.json());
// apply applicarion handler
server.use((req, res) => app(req, res));
server.listen(PORT, () => console.log(
  `Discogs Service is now running on http://localhost:${PORT}`
));
