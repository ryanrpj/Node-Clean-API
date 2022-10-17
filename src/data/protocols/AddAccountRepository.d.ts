import { AddAccountModel } from '../../domain/usecases/AddAccount'
import AccountModel from '../../domain/models/Account'

export default interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
