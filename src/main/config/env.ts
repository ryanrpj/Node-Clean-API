export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/typescript-clean-api',
  serverPort: process.env.PORT ?? 8080
}
