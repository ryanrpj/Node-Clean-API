import GetAccountByToken from '../../../domain/usecases/authentication/GetAccountByToken'
import AccountModel from '../../../domain/models/authentication/Account'
import GetAccountByTokenRepository from '../../protocols/db/GetAccountByTokenRepository'

export default class DbGetAccountByToken implements GetAccountByToken {
  constructor (
    private readonly getAccountByTokenRepository: GetAccountByTokenRepository
  ) {}

  async getByToken (token: string, role: string | undefined): Promise<AccountModel | null> {
    await this.getAccountByTokenRepository.getByToken(token, role)
    return null
  }
}
