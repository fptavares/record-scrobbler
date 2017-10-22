require('dotenv').config();
const modofun = require('./modofun');
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
exports.handler = modofun(
  {
    requestToken: getOauthRequestToken,
    authenticate: authenticate,
    user: [authorize, modofun.arity(1), getDiscogsUser],
    collection: [authorize, modofun.arity(1), getDiscogsCollection],
    collectionAlbum: [authorize, modofun.arity(2), getDiscogsCollectionAlbum],
    release: [authorize, modofun.arity(1), getDiscogsRelease]
  },
  {
    middleware: [logger],
    type: 'aws',
    mode: 'function'
  }
);
