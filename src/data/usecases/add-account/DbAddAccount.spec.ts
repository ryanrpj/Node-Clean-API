import DbAddAccount from './DbAddAccount'
import AccountModel from '../../../domain/models/Account'
import { AddAccountModel } from '../../../domain/usecases/AddAccount'
import AddAccountRepository from '../../protocols/db/AddAccountRepository'
import Hasher from '../../protocols/criptography/Hasher'

interface SutTypes {
  hasher: Hasher
  addAccountRepository: AddAccountRepository
  sut: DbAddAccount
}

class HasherStub implements Hasher {
  async hash (password: string): Promise<string> {
    return 'hashed_password'
  }
}

class AddAccountRepositoryStub implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    return { id: 'valid_id', name: 'valid_name', email: 'valid_email' } as any
  }
}

const makeSut = (): SutTypes => {
  const hasher = new HasherStub()
  const addAccountRepository = new AddAccountRepositoryStub()
  const sut = new DbAddAccount(hasher, addAccountRepository)

  return { hasher, sut, addAccountRepository }
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

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    const addAccountPromise = sut.add(accountData)
    await expect(addAccountPromise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepository } = makeSut()
    const addSpy = jest.spyOn(addAccountRepository, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepository } = makeSut()
    jest.spyOn(addAccountRepository, 'add').mockImplementationOnce(async () => await Promise.reject(new Error()))

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    const addAccountPromise = sut.add(accountData)
    await expect(addAccountPromise).rejects.toThrow()
  })

  test('Should return an AccountModel on success', async () => {
    const { sut } = makeSut()

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    const createdAccount = await sut.add(accountData)

    expect(createdAccount).toEqual({ id: 'valid_id', name: 'valid_name', email: 'valid_email' })
  })
})
