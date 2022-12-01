import { AddAccountModel } from '../../../domain/usecases/authentication/AddAccount'
import AccountModel from '../../../domain/models/authentication/Account'

export default interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
