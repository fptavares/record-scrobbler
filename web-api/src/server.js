import 'dotenv/config';
import graphQLHTTP from 'express-graphql';
import morgan from 'morgan';
import app from './app';
import config from './config';
import { schema } from './data/schema';
import { createLoaders } from './data/dataloaders';

const { GRAPHIQL_USERNAME } = config;

app.use(morgan('tiny'));
app.use('/graphiql', graphQLHTTP(() => {
  return {
    context: { user: { username: GRAPHIQL_USERNAME }, loaders: createLoaders() },
    schema,
    pretty: true,
    graphiql: true,
  };
}));
app.listen(config.API_PORT, () => console.log(
  `Web API is now running on http://localhost:${config.API_PORT}`
));
