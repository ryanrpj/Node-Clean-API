import { AddAccountModel } from '../../../domain/usecases/authentication/AddAccount'
import AccountModel from '../../../domain/models/Account'

export default interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
