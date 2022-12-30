import DbGetAccountByToken from './DbGetAccountByToken'
import GetAccountByIdRepository from '../../protocols/db/GetAccountByIdRepository'
import AccountModel from '../../../domain/models/authentication/Account'
import Decrypter from '../../protocols/criptography/Decrypter'

const makeFakeAccount = (): AccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
  id: 'valid_id'
})

class GetAccountByIdRepositoryStub implements GetAccountByIdRepository {
  async getById (token: string, role?: string): Promise<AccountModel | null> {
    return makeFakeAccount()
  }
}

class DecrypterStub implements Decrypter {
  async decrypt (data: string): Promise<string | null> {
    return 'decrypted_id'
  }
}

interface SutTypes {
  sut: DbGetAccountByToken
  getAccountByIdRepository: GetAccountByIdRepository
  decrypter: Decrypter
}

const makeSut = (): SutTypes => {
  const getAccountByIdRepository = new GetAccountByIdRepositoryStub()
  const decrypter = new DecrypterStub()
  const sut = new DbGetAccountByToken(decrypter, getAccountByIdRepository)

  return { sut, decrypter, getAccountByIdRepository }
}

describe('DbGetAccountByToken', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypter } = makeSut()
    const decryptSpt = jest.spyOn(decrypter, 'decrypt')

    await sut.getByToken('any_token', 'any_role')

    expect(decryptSpt).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Encrypter returns null', async () => {
    const { sut, decrypter } = makeSut()
    jest.spyOn(decrypter, 'decrypt').mockImplementationOnce(async () => null)

    const account = await sut.getByToken('any_token', 'any_role')

    expect(account).toBeNull()
  })

  test('Should return null if Decrypter throws', async () => {
    const { sut, decrypter } = makeSut()
    jest.spyOn(decrypter, 'decrypt').mockImplementationOnce(async () => {
      throw new Error()
    })

    const account = await sut.getByToken('any_token', 'any_role')

    expect(account).toBeNull()
  })

  test('Should call GetAccountByIdRepository with correct values', async () => {
    const { sut, getAccountByIdRepository } = makeSut()
    const getByTokenSpy = jest.spyOn(getAccountByIdRepository, 'getById')

    await sut.getByToken('any_token', 'any_role')

    expect(getByTokenSpy).toHaveBeenCalledWith('decrypted_id', 'any_role')
  })

  test('Should return null if GetAccountByIdRepository returns null', async () => {
    const { sut, getAccountByIdRepository } = makeSut()
    jest.spyOn(getAccountByIdRepository, 'getById').mockImplementationOnce(async () => null)

    const account = await sut.getByToken('any_token', 'any_role')

    expect(account).toBeNull()
  })

  test('Should return an account if GetAccountByIdRepository returns an account', async () => {
    const { sut } = makeSut()

    const account = await sut.getByToken('any_token', 'any_role')

    expect(account).toEqual(makeFakeAccount())
  })

  test('Should throw if GetAccountByIdRepository throws', async () => {
    const { sut, getAccountByIdRepository } = makeSut()
    jest.spyOn(getAccountByIdRepository, 'getById').mockImplementationOnce(async () => {
      throw new Error()
    })

    const promise = sut.getByToken('any_token', 'any_role')

    await expect(promise).rejects.toThrow()
  })
})
