import AddAccountRepository from '../../protocols/db/AddAccountRepository'
import Encrypter from '../../protocols/criptography/Encrypter'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/AddAccount'
import AccountModel from '../../../domain/models/Account'

export default class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    return await this.addAccountRepository.add(Object.assign({}, account, { password: hashedPassword }))
  }
}
