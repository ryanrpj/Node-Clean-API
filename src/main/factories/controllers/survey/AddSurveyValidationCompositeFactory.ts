import Validation from '../../../../presentation/protocols/Validation'
import ValidationComposite from '../../../../presentation/helpers/validators/ValidationComposite'
import RequiredFieldValidation from '../../../../presentation/helpers/validators/RequiredFieldValidation'

const AddSurveyValidationCompositeFactory = {
  makeAddSurveyValidationComposite (): Validation {
    const validations: Validation[] = []

    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }

    return new ValidationComposite(validations)
  }
}

export default AddSurveyValidationCompositeFactory
