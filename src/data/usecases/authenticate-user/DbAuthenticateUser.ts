import AuthenticateUser from '../../../domain/usecases/authentication/AuthenticateUser'
import AuthenticateCredentials from '../../../domain/usecases/authentication/AuthenticateCredentials'
import GetAccountByEmailRepository from '../../protocols/db/GetAccountByEmailRepository'
import HashComparer from '../../protocols/criptography/HashComparer'
import Encrypter from '../../protocols/criptography/Encrypter'

export default class DbAuthenticateUser implements AuthenticateUser {
  constructor (
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async auth (credentials: AuthenticateCredentials): Promise<string> {
    const account = await this.getAccountByEmailRepository.getByEmail(credentials.email)

    if (account) {
      const passwordMatches = await this.hashComparer.compare(credentials.password, account.password)

      if (passwordMatches) {
        return await this.encrypter.encrypt(account.id)
      }
    }

    return ''
  }
}
