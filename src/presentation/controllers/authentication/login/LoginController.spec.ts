import Controller from '../../../protocols/Controller'
import LoginController from './LoginController'
import HttpHelper from '../../../helpers/http/HttpHelper'
import AuthenticateUser from '../../../../domain/usecases/AuthenticateUser'
import AuthenticateCredentials from '../../../../domain/usecases/AuthenticateCredentials'
import HttpRequest from '../../../protocols/HttpRequest'
import ServerError from '../../../errors/ServerError'
import Validation from '../../../protocols/Validation'

interface SutTypes {
  sut: Controller
  validation: Validation
  authenticateUser: AuthenticateUser
}

class ValidationStub implements Validation {
  validate (_: any): Error | null {
    return null
  }
}

class AuthenticateUserStub implements AuthenticateUser {
  async auth (_: AuthenticateCredentials): Promise<string> {
    return 'any_token'
  }
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticateUser = new AuthenticateUserStub()
  return {
    sut: new LoginController(authenticateUser, validationStub),
    validation: validationStub,
    authenticateUser
  }
}

const makeHttpRequest = (): HttpRequest => ({
  body: { email: 'any_email', password: 'any_password' }
})

describe('Login Controller', () => {
  test('Should call Validation with request body', async () => {
    const { sut, validation } = makeSut()

    const validateSpy = jest.spyOn(validation, 'validate')

    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should call AuthenticateUser with correct credentials', async () => {
    const { sut, authenticateUser } = makeSut()

    const auth = jest.spyOn(authenticateUser, 'auth')

    await sut.handle(makeHttpRequest())
    expect(auth).toHaveBeenCalledWith(makeHttpRequest().body)
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(HttpHelper.ok({ access_token: 'any_token' }))
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut()

    jest.spyOn(validation, 'validate').mockReturnValueOnce(new Error('any_error'))

    const response = await sut.handle(makeHttpRequest())
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('any_error'))
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticateUser } = makeSut()

    jest.spyOn(authenticateUser, 'auth').mockReturnValueOnce(Promise.resolve(''))

    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(HttpHelper.unauthorized())
  })

  test('Should return 500 if AuthenticateUser throws', async () => {
    const { sut, authenticateUser } = makeSut()

    jest.spyOn(authenticateUser, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(HttpHelper.serverError(new Error()))
  })

  test('Should return 500 if Validation throws', async () => {
    const { sut, validation } = makeSut()
    jest.spyOn(validation, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(makeHttpRequest())
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })
})
