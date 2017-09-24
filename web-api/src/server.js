import app from './app';
import config from './config';

app.listen(config.API_PORT, () => console.log(
  `Web API is now running on http://localhost:${config.API_PORT}`
));
