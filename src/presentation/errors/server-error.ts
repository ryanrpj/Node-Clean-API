export class ServerError extends Error {
  constructor () {
    super('An unexpected error occurred. Please, try again later.')
    this.name = 'ServerError'
  }
}
