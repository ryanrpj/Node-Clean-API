import JwtAdapter from './JwtAdapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign (data: any, secret: any, options: any, callback: any): void {
    callback(null, 'any_token')
  }
}))

interface SutTypes {
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  return {
    sut: new JwtAdapter('dummy_secret')
  }
}

describe('JwtAdapter', () => {
  test('Should call sign with correct values', async () => {
    const { sut } = makeSut()

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'dummy_secret', expect.anything(), expect.anything())
  })

  test('Should return a token if jwt sign returns a token', async () => {
    const { sut } = makeSut()

    const token = await sut.encrypt('any_id')
    expect(token).toBe('any_token')
  })

  test('Should throw if jwt sign throws', async () => {
    const { sut } = makeSut()

    jest.spyOn(jwt, 'sign').mockImplementationOnce((data: any, secret: any, options: any, callback: any) => {
      callback(new Error('failed_to_sign'))
    })

    const encryptPromise = sut.encrypt('any_id')
    await expect(encryptPromise).rejects.toThrow(new Error('failed_to_sign'))
  })
})
