import AuthenticateUser from '../../../domain/usecases/authentication/AuthenticateUser'
import GetAccountByEmailRepository from '../../protocols/db/GetAccountByEmailRepository'
import AccountModel from '../../../domain/models/Account'
import DbAuthenticateUser from './DbAuthenticateUser'
import HashComparer from '../../protocols/criptography/HashComparer'
import AuthenticateCredentials from '../../../domain/usecases/authentication/AuthenticateCredentials'
import Encrypter from '../../protocols/criptography/Encrypter'

interface SutTypes {
  sut: AuthenticateUser
  getAccountByEmailRepository: GetAccountByEmailRepository
  hashComparer: HashComparer
  encrypter: Encrypter
}

const makeGetAccountByEmailRepositoryStub = (): GetAccountByEmailRepository => {
  class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository {
    async getByEmail (_: string): Promise<AccountModel> {
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
    async compare (_: string, __: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (data: any): Promise<string> {
      return 'any_token'
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const getAccountByEmailRepository = makeGetAccountByEmailRepositoryStub()
  const hashComparer = makeHashComparerStub()
  const encrypter = makeEncrypterStub()
  const sut = new DbAuthenticateUser(getAccountByEmailRepository, hashComparer, encrypter)

  return { sut, getAccountByEmailRepository, hashComparer, encrypter }
}

const makeCredentials = (): AuthenticateCredentials => ({
  email: 'any_email',
  password: 'any_password'
})

describe('DbAuthenticateUser', () => {
  test('Should call GetAccountByEmailRepository with correct e-mail address', async () => {
    const { sut, getAccountByEmailRepository } = makeSut()

    const getSpy = jest.spyOn(getAccountByEmailRepository, 'getByEmail')

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

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypter } = makeSut()

    const generateSpy = jest.spyOn(encrypter, 'encrypt')

    const credentials = makeCredentials()
    await sut.auth(credentials)
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return a token if all credentials are valid', async () => {
    const { sut } = makeSut()

    const credentials = makeCredentials()
    const authToken = await sut.auth(credentials)
    expect(authToken).toBe('any_token')
  })

  test('Should return empty token if GetAccountByEmailRepository returns null', async () => {
    const { sut, getAccountByEmailRepository } = makeSut()

    jest.spyOn(getAccountByEmailRepository, 'getByEmail').mockReturnValueOnce(Promise.resolve(null as any))

    const authToken = await sut.auth(makeCredentials())
    expect(authToken).toBe('')
  })

  test('Should return empty token if HashComparer returns false', async () => {
    const { sut, hashComparer } = makeSut()

    jest.spyOn(hashComparer, 'compare').mockReturnValueOnce(Promise.resolve(false))

    const authToken = await sut.auth(makeCredentials())
    expect(authToken).toBe('')
  })

  test('Should throw if GetAccountByEmailRepository throws', async () => {
    const { sut, getAccountByEmailRepository } = makeSut()

    jest.spyOn(getAccountByEmailRepository, 'getByEmail').mockImplementationOnce(async () => {
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

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypter } = makeSut()

    jest.spyOn(encrypter, 'encrypt').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.auth(makeCredentials())
    await expect(promise).rejects.toThrow()
  })
})
