import Validation from '../../../../presentation/protocols/Validation'
import ValidationComposite from '../../../../presentation/helpers/validators/ValidationComposite'
import RequiredFieldValidation from '../../../../presentation/helpers/validators/RequiredFieldValidation'
import EmailValidation from '../../../../presentation/helpers/validators/EmailValidation'
import EmailValidatorAdapter from '../../../adapters/EmailValidatorAdapter'

const LoginValidationCompositeFactory = {
  makeLoginUpValidationComposite (): Validation {
    const validations: Validation[] = []

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

    return new ValidationComposite(validations)
  }
}

export default LoginValidationCompositeFactory
