import DbAddAccount from './db-add-account'
import AccountModel from '../../../domain/models/account'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import AddAccountRepository from '../../protocols/add-account-repository'
import Encrypter from '../../protocols/encrypter'

interface SutTypes {
  encrypter: Encrypter
  addAccountRepository: AddAccountRepository
  sut: DbAddAccount
}

class EncrypterStub implements Encrypter {
  async encrypt (password: string): Promise<string> {
    return 'hashed_password'
  }
}

class AddAccountRepositoryStub implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    return { id: 'valid_id', name: 'valid_name', email: 'valid_email' }
  }
}

const makeSut = (): SutTypes => {
  const encrypter = new EncrypterStub()
  const addAccountRepository = new AddAccountRepositoryStub()
  const sut = new DbAddAccount(encrypter, addAccountRepository)

  return { encrypter, sut, addAccountRepository }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypter } = makeSut()
    const encryptSpy = jest.spyOn(encrypter, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypter } = makeSut()
    jest.spyOn(encrypter, 'encrypt').mockImplementationOnce(async () => await Promise.reject(new Error()))

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
