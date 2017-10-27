module.exports = {
  PORT: process.env.PORT || 50051,
  DISCOGS_CONSUMER_KEY: process.env.DISCOGS_CONSUMER_KEY,
  DISCOGS_CONSUMER_SECRET: process.env.DISCOGS_CONSUMER_SECRET,
  JWT_SECRET: process.env.JWT_SECRET || "It's a secret...",
  JWT_EXPIRES: process.env.JWT_EXPIRES || '7d',
  GCLOUD_PROJECT: process.env.GCLOUD_PROJECT || 'record-scrobbler',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  COLLECTION_TTL: 60*60*6,
  RELEASE_TTL: 60*60*24*7
}
