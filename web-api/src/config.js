export default {
  API_PORT: 4000,
  DISCOGS_BASEURL: process.env.DISCOGS_BASEURL || 'http://localhost:8010/record-scrobbler/us-central1/discogsService',
  LASTFM_BASEURL: process.env.LASTFM_BASEURL || 'http://localhost:8010/record-scrobbler/us-central1/lastfmService',
  REDIS_URL: process.env.REDIS_URL || '//localhost',
  REDIS_PWD: process.env.REDIS_PWD || null,
  CORS_ORIGIN: 'http://localhost:3000',
  JWT_SECRET: 'shhhhhhared-secret',
  JWT_EXPIRES: '7d',
}
