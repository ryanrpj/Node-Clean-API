import AuthenticationMiddleware from './AuthenticationMiddleware'
import HttpHelper from '../helpers/http/HttpHelper'
import ForbiddenError from '../errors/ForbiddenError'

interface SutTypes {
  sut: AuthenticationMiddleware
}

const makeSut = (): SutTypes => {
  const sut = new AuthenticationMiddleware()

  return { sut }
}

describe('Authentication Middleware', () => {
  test('Should return 403 if x-access-token is absent from request header', async () => {
    const { sut } = makeSut()
    const httpRequest = {}

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(HttpHelper.forbidden(new ForbiddenError()))
  })
})
