import AccountModel from '../../../domain/models/authentication/Account'

export default interface GetAccountByTokenRepository {
  getByToken: (token: string, role?: string) => Promise<AccountModel | null>
}
