import Validation from './Validation'
import EmailValidation from './EmailValidation'
import EmailValidator from '../../protocols/EmailValidator'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

interface SutTypes {
  sut: Validation
  emailValidator: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidator = new EmailValidatorStub()
  return {
    emailValidator,
    sut: new EmailValidation('email', emailValidator)
  }
}

describe('Email Validation', () => {
  test('Should not return an error when e-mail address is valid', () => {
    const { sut } = makeSut()
    const error = sut.validate({ email: 'isValid' })

    expect(error).toBe(null)
  })
})
