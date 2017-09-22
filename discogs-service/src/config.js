module.exports = {
  PORT: process.env.PORT || 50051,
  JWT_SECRET: process.env.JWT_SECRET || "It's a secret...",
  JWT_EXPIRES: process.env.JWT_EXPIRES || '7d'
}
