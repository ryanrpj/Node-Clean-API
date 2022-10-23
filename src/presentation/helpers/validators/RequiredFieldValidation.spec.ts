import Validation from './Validation'
import RequiredFieldValidation from './RequiredFieldValidation'
import MissingParamError from '../../errors/MissingParamError'

interface SutTypes {
  sut: Validation
}

const makeSut = (): SutTypes => {
  return { sut: new RequiredFieldValidation('any_field') }
}

describe('Required Field Validator', () => {
  test('Should not return error when field is present', () => {
    const { sut } = makeSut()
    const error = sut.validate({ any_field: 'isPresent' })

    expect(error).toBe(null)
  })

  test('Should return error when field is absent', () => {
    const { sut } = makeSut()
    const error = sut.validate({ })

    expect(error).toEqual(new MissingParamError('any_field'))
  })
})
