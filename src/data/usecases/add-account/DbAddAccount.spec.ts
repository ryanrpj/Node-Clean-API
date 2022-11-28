import DbAddAccount from './DbAddAccount'
import AccountModel from '../../../domain/models/Account'
import { AddAccountModel } from '../../../domain/usecases/AddAccount'
import AddAccountRepository from '../../protocols/db/AddAccountRepository'
import Hasher from '../../protocols/criptography/Hasher'
import GetAccountByEmailRepository from '../../protocols/db/GetAccountByEmailRepository'

interface SutTypes {
  hasher: Hasher
  addAccountRepository: AddAccountRepository
  sut: DbAddAccount
  getAccountByEmailRepository: GetAccountByEmailRepository
}

class HasherStub implements Hasher {
  async hash (): Promise<string> {
    return 'hashed_password'
  }
}

class AddAccountRepositoryStub implements AddAccountRepository {
  async add (): Promise<AccountModel> {
    return { id: 'valid_id', name: 'valid_name', email: 'valid_email' } as any
  }
}

const makeGetAccountByEmailRepositoryStub = (): GetAccountByEmailRepository => {
  class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository {
    public getByEmail = async (_: string): Promise<AccountModel | null> => null
  }

  return new GetAccountByEmailRepositoryStub()
}

const makeFakeAccount = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeSut = (): SutTypes => {
  const hasher = new HasherStub()
  const addAccountRepository = new AddAccountRepositoryStub()
  const getAccountByEmailRepository = makeGetAccountByEmailRepositoryStub()
  const sut = new DbAddAccount(hasher, addAccountRepository, getAccountByEmailRepository)

  return { hasher, sut, addAccountRepository, getAccountByEmailRepository }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasher } = makeSut()
    const encryptSpy = jest.spyOn(hasher, 'hash')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasher } = makeSut()
    jest.spyOn(hasher, 'hash').mockImplementationOnce(async () => await Promise.reject(new Error()))

    const addAccountPromise = sut.add(makeFakeAccount())
    await expect(addAccountPromise).rejects.toThrow()
  })

  test('Should call GetAccountByEmailRepository with correct e-mail address', async () => {
    const { sut, getAccountByEmailRepository } = makeSut()

    const getSpy = jest.spyOn(getAccountByEmailRepository, 'getByEmail')

    await sut.add(makeFakeAccount())
    expect(getSpy).toHaveBeenCalledWith('valid_email')
  })

  test('Should return null GetAccountByEmailRepository returns an account', async () => {
    const { sut, getAccountByEmailRepository } = makeSut()

    jest.spyOn(getAccountByEmailRepository, 'getByEmail').mockReturnValueOnce(Promise.resolve({} as any))

    const createdAccount = await sut.add(makeFakeAccount())

    expect(createdAccount).toBeNull()
  })

  test('Should throw if GetAccountByEmailRepository throws', async () => {
    const { sut, getAccountByEmailRepository } = makeSut()

    jest.spyOn(getAccountByEmailRepository, 'getByEmail').mockImplementationOnce(async () => {
      throw new Error()
    })

    const promise = sut.add(makeFakeAccount())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepository } = makeSut()
    const addSpy = jest.spyOn(addAccountRepository, 'add')

    await sut.add(makeFakeAccount())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepository } = makeSut()
    jest.spyOn(addAccountRepository, 'add').mockImplementationOnce(async () => await Promise.reject(new Error()))

    const addAccountPromise = sut.add(makeFakeAccount())
    await expect(addAccountPromise).rejects.toThrow()
  })

  test('Should return an AccountModel on success', async () => {
    const { sut } = makeSut()

    const createdAccount = await sut.add(makeFakeAccount())

    expect(createdAccount).toEqual({ id: 'valid_id', name: 'valid_name', email: 'valid_email' })
  })
})
