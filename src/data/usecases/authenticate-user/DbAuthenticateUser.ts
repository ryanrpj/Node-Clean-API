import AuthenticateUser from '../../../domain/usecases/AuthenticateUser'
import AuthenticateCredentials from '../../../domain/usecases/AuthenticateCredentials'
import GetAccountByEmailRepository from '../../protocols/db/GetAccountByEmailRepository'

export default class DbAuthenticateUser implements AuthenticateUser {
  constructor (private readonly getAccountByEmailRepository: GetAccountByEmailRepository) {}

  async auth (credentials: AuthenticateCredentials): Promise<string> {
    await this.getAccountByEmailRepository.get(credentials.email)
    return ''
  }
}
