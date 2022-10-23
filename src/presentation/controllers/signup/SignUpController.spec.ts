import SignUpController from './SignUpController'
import InvalidParamError from '../../errors/InvalidParamError'
import MissingParamError from '../../errors/MissingParamError'
import ServerError from '../../errors/ServerError'
import EmailValidator from '../../protocols/EmailValidator'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/AddAccount'
import AccountModel from '../../../domain/models/Account'
import Validation from '../../helpers/validators/Validation'
import HttpRequest from '../../protocols/HttpRequest'

interface SutTypes {
  sut: SignUpController
  emailValidator: EmailValidator
  addAccount: AddAccount
  validation: Validation
}

class ValidationStub implements Validation {
  validate (input: any): Error | null {
    return null
  }
}

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

class AddAccountStub implements AddAccount {
  async add (account: AddAccountModel): Promise<AccountModel> {
    return {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com'
    }
  }
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = new EmailValidatorStub()
  const addAccountStub = new AddAccountStub()
  const validationStub = new ValidationStub()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)
  return { sut, emailValidator: emailValidatorStub, addAccount: addAccountStub, validation: validationStub }
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()

    delete httpRequest.body.name

    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()

    delete httpRequest.body.email

    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()

    delete httpRequest.body.password

    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const response = await sut.handle(makeHttpRequest())
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidator } = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    await sut.handle(makeHttpRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should call AddAccount with correct email', async () => {
    const { sut, addAccount } = makeSut()
    const addSpy = jest.spyOn(addAccount, 'add')

    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce((_) => {
      throw new Error()
    })

    const response = await sut.handle(makeHttpRequest())
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccount } = makeSut()
    jest.spyOn(addAccount, 'add').mockImplementationOnce(async (_) => await Promise.reject(new Error()))

    const response = await sut.handle(makeHttpRequest())
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })

  test('Should return 201 if all provided values are valid', async () => {
    const { sut } = makeSut()

    const httpRequest = makeHttpRequest()

    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com'
    })
  })

  test('Should call Validation with request body', async () => {
    const { sut, validation } = makeSut()

    const validateSpy = jest.spyOn(validation, 'validate')

    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut()

    jest.spyOn(validation, 'validate').mockReturnValueOnce(new Error('any_error'))

    const response = await sut.handle(makeHttpRequest())

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('any_error'))
  })
})
