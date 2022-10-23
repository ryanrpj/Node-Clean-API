import Controller from '../../protocols/Controller'
import LoginController from './LoginController'
import HttpHelper from '../../helpers/HttpHelper'
import MissingParamError from '../../errors/MissingParamError'
import EmailValidator from '../../protocols/EmailValidator'
import InvalidParamError from '../../errors/InvalidParamError'
import AuthenticateUser from '../../../domain/usecases/AuthenticateUser'
import AuthenticateCredentials from '../../../domain/usecases/AuthenticateCredentials'
import HttpRequest from '../../protocols/HttpRequest'

interface SutTypes {
  sut: Controller
  emailValidator: EmailValidator
  authenticateUser: AuthenticateUser
}

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

class AuthenticateUserStub implements AuthenticateUser {
  async auth (credentials: AuthenticateCredentials): Promise<string> {
    return 'any_token'
  }
}

const makeSut = (): SutTypes => {
  const emailValidator = new EmailValidatorStub()
  const authenticateUser = new AuthenticateUserStub()
  return {
    sut: new LoginController(emailValidator, authenticateUser),
    emailValidator,
    authenticateUser
  }
}

const makeHttpRequest = (): HttpRequest => ({
  body: { email: 'any_email', password: 'any_password' }
})

describe('Login Controller', () => {
  test('Should call EmailValidator with correct e-mail address', async () => {
    const { sut, emailValidator } = makeSut()

    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    await sut.handle({
      body: { email: 'any_email', password: 'any_password' }
    })

    expect(isValidSpy).toHaveBeenCalledWith('any_email')
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

  test('Should return 400 if no e-mail is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: { password: 'any_password' }
    })

    expect(httpResponse).toEqual(HttpHelper.badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: { email: 'any_email' }
    })

    expect(httpResponse).toEqual(HttpHelper.badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if an invalid e-mail is provided', async () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(HttpHelper.badRequest(new InvalidParamError('email')))
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticateUser } = makeSut()

    jest.spyOn(authenticateUser, 'auth').mockReturnValueOnce(Promise.resolve(''))

    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(HttpHelper.unauthorized())
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(HttpHelper.serverError(new Error()))
  })

  test('Should return 500 if AuthenticateUser throws', async () => {
    const { sut, authenticateUser } = makeSut()

    jest.spyOn(authenticateUser, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(HttpHelper.serverError(new Error()))
  })
})
