import Controller from '../../protocols/Controller'
import LoginController from './LoginController'
import HttpHelper from '../../helpers/HttpHelper'
import MissingParamError from '../../errors/MissingParamError'
import EmailValidator from '../../protocols/EmailValidator'
import InvalidParamError from '../../errors/InvalidParamError'

interface SutTypes {
  sut: Controller
  emailValidator: EmailValidator
}

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

const makeSut = (): SutTypes => {
  const emailValidator = new EmailValidatorStub()
  return {
    sut: new LoginController(emailValidator),
    emailValidator
  }
}

describe('Login Controller', () => {
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

    const httpResponse = await sut.handle({
      body: { email: 'any_email', password: 'any_password' }
    })

    expect(httpResponse).toEqual(HttpHelper.badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct e-mail address', async () => {
    const { sut, emailValidator } = makeSut()

    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    await sut.handle({
      body: { email: 'any_email', password: 'any_password' }
    })

    expect(isValidSpy).toHaveBeenCalledWith('any_email')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle({
      body: { email: 'any_email', password: 'any_password' }
    })

    expect(httpResponse).toEqual(HttpHelper.serverError(new Error()))
  })
})
