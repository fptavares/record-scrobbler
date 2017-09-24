const config = {
  API_HOST: process.env.API_HOST || 'localhost',
  API_PORT: process.env.API_PORT || 4000,
};

config.API_BASEURL = `http://${config.API_HOST}:${config.API_PORT}`;

export default config;
