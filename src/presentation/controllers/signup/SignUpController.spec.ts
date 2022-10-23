import SignUpController from './SignUpController'
import ServerError from '../../errors/ServerError'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/AddAccount'
import AccountModel from '../../../domain/models/Account'
import Validation from '../../protocols/Validation'
import HttpRequest from '../../protocols/HttpRequest'

interface SutTypes {
  sut: SignUpController
  addAccount: AddAccount
  validation: Validation
}

class ValidationStub implements Validation {
  validate (_: any): Error | null {
    return null
  }
}

class AddAccountStub implements AddAccount {
  async add (_: AddAccountModel): Promise<AccountModel> {
    return {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com'
    }
  }
}

const makeSut = (): SutTypes => {
  const addAccountStub = new AddAccountStub()
  const validationStub = new ValidationStub()
  const sut = new SignUpController(addAccountStub, validationStub)
  return { sut, addAccount: addAccountStub, validation: validationStub }
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

describe('SignUp Controller', () => {
  test('Should call Validation with request body', async () => {
    const { sut, validation } = makeSut()

    const validateSpy = jest.spyOn(validation, 'validate')

    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should call AddAccount with correct email', async () => {
    const { sut, addAccount } = makeSut()
    const addSpy = jest.spyOn(addAccount, 'add')

    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
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

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut()

    jest.spyOn(validation, 'validate').mockReturnValueOnce(new Error('any_error'))

    const response = await sut.handle(makeHttpRequest())
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('any_error'))
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccount } = makeSut()
    jest.spyOn(addAccount, 'add').mockImplementationOnce(async (_) => await Promise.reject(new Error()))

    const response = await sut.handle(makeHttpRequest())
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
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
