import AccountModel from '../../../domain/models/authentication/Account'

export default interface GetAccountByEmailRepository {
  getByEmail: (email: string) => Promise<AccountModel | null>
}
