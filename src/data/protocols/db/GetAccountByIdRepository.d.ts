import AccountModel from '../../../domain/models/authentication/Account'

export default interface GetAccountByIdRepository {
  getById: (id: string, role?: string) => Promise<AccountModel | null>
}
