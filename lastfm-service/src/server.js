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
server.use(app);
server.listen(PORT, () => console.log(
  `Last.fm Service is now running on http://localhost:${PORT}`
));
