import bcrypt from 'bcrypt'
import BcryptAdapter from './BcryptAdapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hashed_value'
  },

  async compare (): Promise<boolean> {
    return true
  }
}))

const SALT = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(SALT)
}

describe('Bcrypt Adapter', function () {
  test('Should call hash with correct value and salt', async () => {
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

  test('Should throw if bcrypt hash throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => await Promise.reject(new Error()))

    const encryptPromise = sut.hash('any_value')
    await expect(encryptPromise).rejects.toThrow()
  })

  test('Should call compare with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')

    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('Should return true when comparison succeeds', async () => {
    const sut = makeSut()

    const comparisonResult = await sut.compare('any_value', 'any_hash')
    expect(comparisonResult).toBe(true)
  })

  test('Should return false when comparison fails', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => false)

    const comparisonResult = await sut.compare('any_value', 'any_hash')
    expect(comparisonResult).toBe(false)
  })

  test('Should throw if bcrypt compare throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.reject(new Error()))

    const comparePromise = sut.compare('any_value', 'any_hash')
    await expect(comparePromise).rejects.toThrow()
  })
})
