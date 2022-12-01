import AddAccountRepository from '../../protocols/db/AddAccountRepository'
import Hasher from '../../protocols/criptography/Hasher'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/authentication/AddAccount'
import AccountModel from '../../../domain/models/Account'
import GetAccountByEmailRepository from '../../protocols/db/GetAccountByEmailRepository'

export default class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel | null> {
    const existingAccount = await this.getAccountByEmailRepository.getByEmail(account.email)

    if (existingAccount) {
      return null
    }

    const hashedPassword = await this.hasher.hash(account.password)
    return await this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))
  }
}
