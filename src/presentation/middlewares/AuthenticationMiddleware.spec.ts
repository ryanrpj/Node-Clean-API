import AuthenticationMiddleware from './AuthenticationMiddleware'
import HttpHelper from '../helpers/http/HttpHelper'
import ForbiddenError from '../errors/ForbiddenError'
import HttpRequest from '../protocols/HttpRequest'
import GetAccountByToken from '../../domain/usecases/authentication/GetAccountByToken'
import AccountModel from '../../domain/models/authentication/Account'

const makeFakeAccount = (): AccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
  id: 'valid_id'
})

class GetAccountByTokenStub implements GetAccountByToken {
  async getByToken (token: string, role: string | undefined): Promise<AccountModel | null> {
    return makeFakeAccount()
  }
}

interface SutTypes {
  sut: AuthenticationMiddleware
  getAccountByToken: GetAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const getAccountByToken = new GetAccountByTokenStub()
  const sut = new AuthenticationMiddleware(getAccountByToken, role)

  return { sut, getAccountByToken }
}

const makeHttpRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})

describe('Authentication Middleware', () => {
  test('Should return 403 if x-access-token is absent from request header', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({ })

    expect(response).toEqual(HttpHelper.forbidden(new ForbiddenError()))
  })

  test('Should call GetAccountByToken with correct values', async () => {
    const role = 'any_role'
    const { sut, getAccountByToken } = makeSut(role)
    const getByTokenSpy = jest.spyOn(getAccountByToken, 'getByToken')
    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)

    expect(getByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return 403 if GetAccountByToken returns null', async () => {
    const { sut, getAccountByToken } = makeSut()
    jest.spyOn(getAccountByToken, 'getByToken').mockImplementationOnce(async () => null)
    const httpRequest = makeHttpRequest()

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(HttpHelper.forbidden(new ForbiddenError()))
  })

  test('Should return 500 if GetAccountByToken throws', async () => {
    const { sut, getAccountByToken } = makeSut()
    jest.spyOn(getAccountByToken, 'getByToken').mockImplementationOnce(async () => {
      throw new Error()
    })
    const httpRequest = makeHttpRequest()

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(HttpHelper.serverError(new Error()))
  })
})
