import 'dotenv/config';
import express from 'express';
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
  JWT_SECRET,
  GRAPHIQL_USERNAME
} = config;

// instatiate Redis client on app load
initRedisClient();

// create express application
const app = express();
app.use(morgan('tiny'));
app.use(cors({
  origin: CORS_ORIGIN,
  //optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(jwt({
  secret: JWT_SECRET,
  credentialsRequired: false,
}));//.unless({path: ['/token', '/graphiql']}));

app.use('/graphql', graphQLHTTP(req => {
  return {
    context: { user: req.user, loaders: createLoaders(req.user) },
    schema,
    formatError: error => {
      console.error('Graphql error:', error);
      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
        path: error.path
      };
    }
  };
}));
app.use('/graphiql', graphQLHTTP(() => {
  return {
    context: { user: { username: GRAPHIQL_USERNAME }, loaders: createLoaders() },
    schema,
    pretty: true,
    graphiql: true,
  };
}));
// error handling
app.use(function (err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Unauthorized - please authenticate.'
    });
  }
  console.error(err);
});

export default app;
