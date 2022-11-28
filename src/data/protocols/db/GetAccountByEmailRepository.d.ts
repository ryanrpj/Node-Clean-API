import AccountModel from '../../../domain/models/Account'

export default interface GetAccountByEmailRepository {
  getByEmail: (email: string) => Promise<AccountModel | null>
}
