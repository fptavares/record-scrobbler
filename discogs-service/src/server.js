import 'dotenv/config';
import app from './app';
import serverConfig from './config';

const {
  API_PORT,
} = serverConfig;

app.listen(API_PORT, () => console.log(
  `Web API Server is now running on http://localhost:${API_PORT}`
));
