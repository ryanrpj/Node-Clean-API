import { AddAccount, AddAccountModel } from '../../../domain/usecases'
import { AccountModel } from '../../../domain/models'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)

    return {
      id: 'account_id',
      name: 'account_name',
      email: 'account_email'
    }
  }
}
