import { AddAccountModel } from '../../domain/usecases/add-account'
import AccountModel from '../../domain/models/account'

export default interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
