import modofun from 'modofun';
import morgan from 'morgan';
import graphQLHTTP from 'express-graphql';
import cors from 'cors';
import jwt from 'express-jwt';

import { schema } from './data/schema';
import { createLoaders } from './data/dataloaders';
import { initRedisClient } from './data/playlist-client';

import config from './config';

const {
  CORS_ORIGIN,
  JWT_SECRET
} = config;

// instatiate Redis client on app load
initRedisClient();

// instantiate middlewares
const logger = morgan('tiny');
const corsHeaders = cors({
  origin: CORS_ORIGIN,
  maxAge: 600
});
const authorize = jwt({
  secret: JWT_SECRET,
  credentialsRequired: false,
});

// instantiate GraphQL handler
const graphql = graphQLHTTP(req => ({
  context: { user: req.user, loaders: createLoaders(req.user) },
  schema
}));

// create application
export default modofun({ graphql }, {
  mode: 'reqres',
  middleware: [logger, corsHeaders, authorize],
});
