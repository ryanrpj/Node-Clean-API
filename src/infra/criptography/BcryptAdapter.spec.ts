import bcrypt from 'bcrypt'
import BcryptAdapter from './BcryptAdapter'
import Hasher from '../../data/protocols/criptography/Hasher'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hashed_value'
  }
}))

const SALT = 12

const makeSut = (): Hasher => {
  return new BcryptAdapter(SALT)
}

describe('Bcrypt Adapter', function () {
  test('Should call bcrypt with correct value and salt', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
  })

  test('Should return hashed value on success', async () => {
    const sut = makeSut()

    const hashedValue = await sut.hash('any_value')
    expect(hashedValue).toBe('hashed_value')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => await Promise.reject(new Error()))

    const encryptPromise = sut.hash('any_value')
    await expect(encryptPromise).rejects.toThrow()
  })
})
