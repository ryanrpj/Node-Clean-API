import GetAccountByToken from '../../../domain/usecases/authentication/GetAccountByToken'
import AccountModel from '../../../domain/models/authentication/Account'
import GetAccountByTokenRepository from '../../protocols/db/GetAccountByTokenRepository'
import Decrypter from '../../protocols/criptography/Decrypter'

export default class DbGetAccountByToken implements GetAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly getAccountByTokenRepository: GetAccountByTokenRepository
  ) {}

  async getByToken (token: string, role: string | undefined): Promise<AccountModel | null> {
    await this.decrypter.decrypt(token)

    const account = await this.getAccountByTokenRepository.getByToken(token, role)

    if (!account) {
      return null
    }

    return account
  }
}
