import DbGetAccountByToken from './DbGetAccountByToken'
import GetAccountByTokenRepository from '../../protocols/db/GetAccountByTokenRepository'
import AccountModel from '../../../domain/models/authentication/Account'
import Decrypter from '../../protocols/criptography/Decrypter'

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

class DecrypterStub implements Decrypter {
  async decrypt (data: string): Promise<string | null> {
    return 'decrypted_token'
  }
}

interface SutTypes {
  sut: DbGetAccountByToken
  getAccountByTokenRepository: GetAccountByTokenRepository
  decrypter: Decrypter
}

const makeSut = (): SutTypes => {
  const getAccountByTokenRepository = new GetAccountByTokenRepositoryStub()
  const decrypter = new DecrypterStub()
  const sut = new DbGetAccountByToken(decrypter, getAccountByTokenRepository)

  return { sut, decrypter, getAccountByTokenRepository }
}

describe('DbGetAccountByToken', () => {
  test('Should call Encrypter with correct value', async () => {
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

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypter } = makeSut()
    jest.spyOn(decrypter, 'decrypt').mockImplementationOnce(async () => {
      throw new Error()
    })

    const promise = sut.getByToken('any_token', 'any_role')

    await expect(promise).rejects.toThrow()
  })

  test('Should call GetAccountByTokenRepository with correct values', async () => {
    const { sut, getAccountByTokenRepository } = makeSut()
    const getByTokenSpy = jest.spyOn(getAccountByTokenRepository, 'getByToken')

    await sut.getByToken('any_token', 'any_role')

    expect(getByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return null if GetAccountByTokenRepository returns null', async () => {
    const { sut, getAccountByTokenRepository } = makeSut()
    jest.spyOn(getAccountByTokenRepository, 'getByToken').mockImplementationOnce(async () => null)

    const account = await sut.getByToken('any_token', 'any_role')

    expect(account).toBeNull()
  })

  test('Should return an account if GetAccountByTokenRepository returns an account', async () => {
    const { sut } = makeSut()

    const account = await sut.getByToken('any_token', 'any_role')

    expect(account).toEqual(makeFakeAccount())
  })

  test('Should throw if GetAccountByTokenRepository throws', async () => {
    const { sut, getAccountByTokenRepository } = makeSut()
    jest.spyOn(getAccountByTokenRepository, 'getByToken').mockImplementationOnce(async () => {
      throw new Error()
    })

    const promise = sut.getByToken('any_token', 'any_role')

    await expect(promise).rejects.toThrow()
  })
})
