import modofun from 'modofun';
import morgan from 'morgan';
import jwt from 'express-jwt';
import config from './config';
import {
  getDiscogsCollection,
  getDiscogsCollectionAlbum,
  getDiscogsRelease,
  getDiscogsUser,
  getOauthRequestToken,
  authenticate
} from './service-controller';

// instantiate middlewares
const logger = morgan('tiny');
const authorize = jwt({ secret: config.JWT_SECRET });

// define routes
const app = modofun(
  {
    requestToken: getOauthRequestToken,
    authenticate: authenticate,
    user: [authorize, getDiscogsUser],
    collection: [authorize, getDiscogsCollection],
    collectionAlbum: [authorize, getDiscogsCollectionAlbum],
    release: [authorize, getDiscogsRelease]
  },
  [logger]
);

export default app;
