export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://mongodb:27017/typescript-clean-api',
  serverPort: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'dummy_secret'
}
