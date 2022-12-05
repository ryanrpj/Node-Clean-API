import DbGetAccountByToken from './DbGetAccountByToken'
import GetAccountByTokenRepository from '../../protocols/db/GetAccountByTokenRepository'
import AccountModel from '../../../domain/models/authentication/Account'

const makeFakeAccount = (): AccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
  id: 'valid_id'
})

class GetAccountByTokenRepositoryStub implements GetAccountByTokenRepository {
  async getByToken (token: string, role?: string): Promise<AccountModel | null> {
    return makeFakeAccount()
  }
}

interface SutTypes {
  sut: DbGetAccountByToken
  getAccountByTokenRepository: GetAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const getAccountByTokenRepository = new GetAccountByTokenRepositoryStub()
  const sut = new DbGetAccountByToken(getAccountByTokenRepository)

  return { sut, getAccountByTokenRepository }
}

describe('DbGetAccountByToken', () => {
  test('Should call GetAccountByTokenRepository with correct values', async () => {
    const { sut, getAccountByTokenRepository } = makeSut()
    const getByTokenSpy = jest.spyOn(getAccountByTokenRepository, 'getByToken')

    await sut.getByToken('any_token', 'any_role')

    expect(getByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })
})
