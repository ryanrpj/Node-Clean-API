import GetAccountByToken from '../../../domain/usecases/authentication/GetAccountByToken'
import AccountModel from '../../../domain/models/authentication/Account'
import GetAccountByIdRepository from '../../protocols/db/GetAccountByIdRepository'
import Decrypter from '../../protocols/criptography/Decrypter'

export default class DbGetAccountByToken implements GetAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly getAccountByIdRepository: GetAccountByIdRepository
  ) {}

  async getByToken (token: string, role: string | undefined): Promise<AccountModel | null> {
    const accountId = await this.decrypter.decrypt(token)

    if (!accountId) {
      return null
    }

    const account = await this.getAccountByIdRepository.getById(accountId, role)

    if (!account) {
      return null
    }

    return account
  }
}
