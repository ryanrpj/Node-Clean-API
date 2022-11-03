import AddAccountRepository from '../../protocols/db/AddAccountRepository'
import Hasher from '../../protocols/criptography/Hasher'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/AddAccount'
import AccountModel from '../../../domain/models/Account'

export default class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)
    return await this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))
  }
}
