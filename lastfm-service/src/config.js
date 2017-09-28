module.exports = {
  PORT: process.env.PORT || 50052,
  LASTFM_API_KEY: process.env.LASTFM_API_KEY,
  LASTFM_SECRET: process.env.LASTFM_SECRET,
  JWT_SECRET: process.env.JWT_SECRET || "It's a secret...",
  JWT_EXPIRES: process.env.JWT_EXPIRES || '7d'
}
