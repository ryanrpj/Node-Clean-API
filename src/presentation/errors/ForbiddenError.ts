export default class ForbiddenError extends Error {
  constructor () {
    super('You need privileged access to perform this action.')
    this.name = 'Unauthorized'
  }
}
