import AuthenticateUser from '../../../domain/usecases/AuthenticateUser'
import GetAccountByEmailRepository from '../../protocols/db/GetAccountByEmailRepository'
import AccountModel from '../../../domain/models/Account'
import DbAuthenticateUser from './DbAuthenticateUser'
import HashComparer from '../../protocols/criptography/HashComparer'
import AuthenticateCredentials from '../../../domain/usecases/AuthenticateCredentials'
import TokenGenerator from '../../protocols/criptography/TokenGenerator'

interface SutTypes {
  sut: AuthenticateUser
  getAccountByEmailRepository: GetAccountByEmailRepository
  hashComparer: HashComparer
  tokenGenerator: TokenGenerator
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

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (data: any): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }

  return new TokenGeneratorStub()
}

const makeSut = (): SutTypes => {
  const getAccountByEmailRepository = makeGetAccountByEmailRepositoryStub()
  const hashComparer = makeHashComparerStub()
  const tokenGenerator = makeTokenGeneratorStub()
  const sut = new DbAuthenticateUser(getAccountByEmailRepository, hashComparer, tokenGenerator)

  return { sut, getAccountByEmailRepository, hashComparer, tokenGenerator }
}

const makeCredentials = (): AuthenticateCredentials => ({
  email: 'any_email',
  password: 'any_password'
})

describe('DbAuthenticateUser', () => {
  test('Should call GetAccountByEmailRepository with correct e-mail address', async () => {
    const { sut, getAccountByEmailRepository } = makeSut()

    const getSpy = jest.spyOn(getAccountByEmailRepository, 'get')

    await sut.auth(makeCredentials())
    expect(getSpy).toHaveBeenCalledWith('any_email')
  })

  test('Should call HashComparer with correct password and hash', async () => {
    const { sut, hashComparer } = makeSut()

    const compareSpy = jest.spyOn(hashComparer, 'compare')

    const credentials = makeCredentials()
    await sut.auth(credentials)
    expect(compareSpy).toHaveBeenCalledWith(credentials.password, 'hashed_password')
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGenerator } = makeSut()

    const generateSpy = jest.spyOn(tokenGenerator, 'generate')

    const credentials = makeCredentials()
    await sut.auth(credentials)
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return empty token if GetAccountByEmailRepository returns null', async () => {
    const { sut, getAccountByEmailRepository } = makeSut()

    jest.spyOn(getAccountByEmailRepository, 'get').mockReturnValueOnce(Promise.resolve(null as any))

    const authToken = await sut.auth(makeCredentials())
    expect(authToken).toBe('')
  })

  test('Should return empty token if HashComparer returns false', async () => {
    const { sut, hashComparer } = makeSut()

    jest.spyOn(hashComparer, 'compare').mockReturnValueOnce(false)

    const authToken = await sut.auth(makeCredentials())
    expect(authToken).toBe('')
  })

  test('Should throw if GetAccountByEmailRepository throws', async () => {
    const { sut, getAccountByEmailRepository } = makeSut()

    jest.spyOn(getAccountByEmailRepository, 'get').mockImplementationOnce(async () => {
      throw new Error()
    })

    const promise = sut.auth(makeCredentials())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparer } = makeSut()

    jest.spyOn(hashComparer, 'compare').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.auth(makeCredentials())
    await expect(promise).rejects.toThrow()
  })
})
