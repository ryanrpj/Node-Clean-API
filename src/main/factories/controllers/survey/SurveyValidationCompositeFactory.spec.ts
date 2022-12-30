import ValidationComposite from '../../../../presentation/helpers/validators/ValidationComposite'
import RequiredFieldValidation from '../../../../presentation/helpers/validators/RequiredFieldValidation'
import Validation from '../../../../presentation/protocols/Validation'
import AddSurveyValidationCompositeFactory from './AddSurveyValidationCompositeFactory'

jest.mock('../../../../presentation/helpers/validators/ValidationComposite')
describe('AddSurvey ValidationComposite Factory', () => {
  test('Should build composite with all necessary validations', () => {
    AddSurveyValidationCompositeFactory.makeAddSurveyValidationComposite()

    const validations: Validation[] = []

    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
