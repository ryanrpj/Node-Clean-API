import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes {
  encrypter: Encrypter
  sut: DbAddAccount
}

class EncrypterStub implements Encrypter {
  async encrypt (password: string): Promise<string> {
    return 'hashed_password'
  }
}

const makeSut = (): SutTypes => {
  const encrypter = new EncrypterStub()
  const sut = new DbAddAccount(encrypter)

  return { encrypter, sut }
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
})
