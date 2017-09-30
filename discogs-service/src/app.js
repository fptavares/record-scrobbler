import express from 'express';
import morgan from 'morgan';
import jwt from 'express-jwt';
import modfun from 'modfun';
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
const app = modfun(
  {
    requestToken: getOauthRequestToken,
    authenticate: authenticate,
    user: [authorize, modfun.arity(1), getDiscogsUser],
    collection: [authorize, modfun.arity(1), getDiscogsCollection],
    collectionAlbum: [authorize, modfun.arity(2), getDiscogsCollectionAlbum],
    release: [authorize, modfun.arity(1), getDiscogsRelease]
  },
  {
    mode: 'function',
    middleware: [logger]
  }
);

export default app;
