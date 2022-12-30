export default class EmailAlreadyInUseError extends Error {
  constructor () {
    super('The provided e-mail address is already in use by another user.')
    this.name = 'EmailAlreadyInUseError'
  }
}
