import ValidationComposite from '../../presentation/helpers/validators/ValidationComposite'
import SignUpValidationCompositeFactory from './SignUpValidationCompositeFactory'
import RequiredFieldValidation from '../../presentation/helpers/validators/RequiredFieldValidation'
import Validation from '../../presentation/helpers/validators/Validation'
import EmailValidation from '../../presentation/helpers/validators/EmailValidation'
import EmailValidator from '../../presentation/protocols/EmailValidator'

jest.mock('../../presentation/helpers/validators/ValidationComposite')

class EmailValidatorStub implements EmailValidator {
  isValid (_: string): boolean {
    return true
  }
}

describe('SignUp ValidationComposite Factory', () => {
  test('Should build composite with all necessary validations', () => {
    SignUpValidationCompositeFactory.makeSignUpValidationComposite()

    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', new EmailValidatorStub()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
