import Validation from './Validation'
import RequiredFieldValidation from './RequiredFieldValidation'

interface SutTypes {
  sut: Validation
}

const makeSut = (): SutTypes => {
  return { sut: new RequiredFieldValidation('any_field') }
}

describe('Required Field Validator', () => {
  test('Should not return error when is present', () => {
    const { sut } = makeSut()
    const error = sut.validate({ any_field: 'isPresent' })

    expect(error).toBe(null)
  })
})
