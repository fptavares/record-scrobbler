import express from 'express';
import graphQLHTTP from 'express-graphql';
import cors from 'cors';
import jwt from 'express-jwt';

import { schema } from './data/schema';
import { createLoaders } from './data/dataloaders';
import { initRedisClient } from './data/playlist-client';

import config from './config';

const {
  CORS_ORIGIN,
  JWT_SECRET,
  //GRAPHIQL_USERNAME
} = config;

// instatiate Redis client on app load
initRedisClient();

// create express application
const app = express();
app.use(cors({
  origin: CORS_ORIGIN,
  maxAge: 600
}));
app.use(jwt({
  secret: JWT_SECRET,
  credentialsRequired: false,
}));

app.use('/graphql', graphQLHTTP(req => {
  return {
    context: { user: req.user, loaders: createLoaders(req.user) },
    schema,
    /*formatError: error => {
      console.error('Graphql error:', error);
      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
        path: error.path
      };
    }*/
  };
}));
// error handling
app.use(function (err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({message: 'Invalid token'});
  } else {
    console.error(err);
    res.status(500).json({message: err.message})
  }
});

export default app;
