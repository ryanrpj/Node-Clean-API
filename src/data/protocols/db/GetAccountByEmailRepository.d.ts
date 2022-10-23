import AccountModel from '../../../domain/models/Account'

export default interface GetAccountByEmailRepository {
  get: (email: string) => Promise<AccountModel>
}
