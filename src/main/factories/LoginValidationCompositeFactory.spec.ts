import ValidationComposite from '../../presentation/helpers/validators/ValidationComposite'
import RequiredFieldValidation from '../../presentation/helpers/validators/RequiredFieldValidation'
import Validation from '../../presentation/helpers/validators/Validation'
import EmailValidation from '../../presentation/helpers/validators/EmailValidation'
import EmailValidator from '../../presentation/protocols/EmailValidator'
import LoginValidationCompositeFactory from './LoginValidationCompositeFactory'

jest.mock('../../presentation/helpers/validators/ValidationComposite')

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

describe('Login ValidationComposite Factory', () => {
  test('Should build composite with all necessary validations', () => {
    LoginValidationCompositeFactory.makeLoginUpValidationComposite()

    const validations: Validation[] = []

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', new EmailValidatorStub()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
