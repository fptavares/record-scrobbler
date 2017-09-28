import morgan from 'morgan';
import jwt from 'express-jwt';
import {
  authenticate,
  getAuthenticationUrl,
  getUser,
  scrobble
} from './lastfm-controller';
import modfun from 'modfun';
import config from './config';

const authorize = jwt({ secret: config.JWT_SECRET });
const logger = morgan('tiny');

const app = modfun(
  {
    authenticationUrl: getAuthenticationUrl,
    authenticate: authenticate,
    user: [authorize, getUser],
    scrobble: [authorize, scrobble]
  },
  [logger]
);

export default app
