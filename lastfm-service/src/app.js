import morgan from 'morgan';
import jwt from 'express-jwt';
import {
  authenticate,
  getAuthenticationUrl,
  getUser,
  scrobble
} from './lastfm-controller';
import modofun from 'modofun';
import config from './config';

const authorize = jwt({ secret: config.JWT_SECRET });
const logger = morgan('tiny');

const app = modofun(
  {
    authenticationUrl: getAuthenticationUrl,
    authenticate: authenticate,
    user: [authorize, getUser],
    scrobble: [authorize, scrobble]
  },
  {
    mode: 'reqres',
    middleware: [logger]
  }
);

export default app
