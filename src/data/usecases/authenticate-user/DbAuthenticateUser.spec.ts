import AuthenticateUser from '../../../domain/usecases/AuthenticateUser'
import GetAccountByEmailRepository from '../../protocols/db/GetAccountByEmailRepository'
import AccountModel from '../../../domain/models/Account'
import DbAuthenticateUser from './DbAuthenticateUser'
import HashComparer from '../../protocols/criptography/HashComparer'

interface SutTypes {
  sut: AuthenticateUser
  getAccountByEmailRepository: GetAccountByEmailRepository
  hashComparer: HashComparer
}

const makeGetAccountByEmailRepositoryStub = (): GetAccountByEmailRepository => {
  class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository {
    async get (_: string): Promise<AccountModel> {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'hashed_password'
      }
    }
  }

  return new GetAccountByEmailRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    compare (_: string, __: string): boolean {
      return true
    }
  }

  return new HashComparerStub()
}

const makeSut = (): SutTypes => {
  const getAccountByEmailRepository = makeGetAccountByEmailRepositoryStub()
  const hashComparer = makeHashComparerStub()
  const sut = new DbAuthenticateUser(getAccountByEmailRepository, hashComparer)

  return { sut, getAccountByEmailRepository, hashComparer }
}

describe('DbAuthenticateUser', () => {
  test('Should call GetAccountByEmailRepository with correct e-mail address', async () => {
    const { sut, getAccountByEmailRepository } = makeSut()

    const getSpy = jest.spyOn(getAccountByEmailRepository, 'get')

    await sut.auth({ email: 'any_email', password: 'any_password' })
    expect(getSpy).toHaveBeenCalledWith('any_email')
  })

  test('Should throw if GetAccountByEmailRepository throws', async () => {
    const { sut, getAccountByEmailRepository } = makeSut()

    jest.spyOn(getAccountByEmailRepository, 'get').mockImplementationOnce(async () => {
      throw new Error()
    })

    const promise = sut.auth({ email: 'any_email', password: 'any_password' })
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparer } = makeSut()

    jest.spyOn(hashComparer, 'compare').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.auth({ email: 'any_email', password: 'any_password' })
    await expect(promise).rejects.toThrow()
  })

  test('Should call HashComparer with correct password and hash', async () => {
    const { sut, hashComparer } = makeSut()

    const compareSpy = jest.spyOn(hashComparer, 'compare')

    await sut.auth({ email: 'any_email', password: 'any_password' })
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })
})
