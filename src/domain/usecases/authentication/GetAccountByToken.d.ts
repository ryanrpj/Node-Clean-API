import AccountModel from '../../models/authentication/Account'

export default interface GetAccountByToken {
  getByToken: (token: string, role?: string) => Promise<AccountModel | null>
}
