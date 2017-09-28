export default {
  API_PORT: 4000,
  DISCOGS_BASEURL: process.env.DISCOGS_BASEURL || 'http://localhost:8010/record-scrobbler/us-central1/discogsService',
  DISCOGS_TIMEOUT: process.env.DISCOGS_TIMEOUT || 30000,
  LASTFM_BASEURL: process.env.LASTFM_BASEURL || 'http://localhost:8010/record-scrobbler/us-central1/lastfmService',
  LASTFM_TIMEOUT: process.env.LASTFM_TIMEOUT || 30000,
  REDIS_URL: process.env.REDIS_URL || '//localhost',
  REDIS_PWD: process.env.REDIS_PWD || null,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || "It's a secret...",
  JWT_EXPIRES: process.env.JWT_EXPIRES || '3d',
  GRAPHIQL_USERNAME: process.env.GRAPHIQL_USERNAME
}
