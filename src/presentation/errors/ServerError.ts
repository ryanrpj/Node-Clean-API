export default class ServerError extends Error {
  constructor (error?: Error) {
    super('An unexpected error occurred. Please, try again later.')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}
