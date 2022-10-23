import AuthenticateUser from '../../../domain/usecases/AuthenticateUser'
import GetAccountByEmailRepository from '../../protocols/GetAccountByEmailRepository'
import AccountModel from '../../../domain/models/Account'
import DbAuthenticateUser from './DbAuthenticateUser'

interface SutTypes {
  sut: AuthenticateUser
  getAccountByEmailRepository: GetAccountByEmailRepository
}

const makeGetAccountByEmailRepositoryStub = (): GetAccountByEmailRepository => {
  class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository {
    async get (email: string): Promise<AccountModel> {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email'
      }
    }
  }

  return new GetAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const getAccountByEmailRepository = makeGetAccountByEmailRepositoryStub()
  const sut = new DbAuthenticateUser(getAccountByEmailRepository)

  return { sut, getAccountByEmailRepository }
}

describe('DbAuthenticateUser', () => {
  test('Should call GetAccountByEmailRepository with correct e-mail address', async () => {
    const { sut, getAccountByEmailRepository } = makeSut()

    const getSpy = jest.spyOn(getAccountByEmailRepository, 'get')

    await sut.auth({ email: 'any_email', password: 'any_password' })

    expect(getSpy).toHaveBeenCalledWith('any_email')
  })
})
