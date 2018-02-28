import 'dotenv/config';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import app from './app';
import config from './config';
import { schema } from './data/schema';
import { createLoaders } from './data/dataloaders';

const { GRAPHIQL_USERNAME } = config;

const server = express();
server.use('/graphiql', graphQLHTTP(() => {
  return {
    context: { user: { username: GRAPHIQL_USERNAME }, loaders: createLoaders() },
    schema,
    pretty: true,
    graphiql: true,
  };
}));
server.use(app); // apply applicarion handler
server.listen(config.API_PORT, () => console.log(
  `Web API is now running on http://localhost:${config.API_PORT}`
));
