import Validation from '../../protocols/Validation'
import ValidationComposite from './ValidationComposite'

class ValidationStub implements Validation {
  validate (input: any): Error | null {
    return null
  }
}
interface SutTypes {
  sut: Validation
  validations: Validation[]
}

const makeSut = (): SutTypes => {
  const validations = [new ValidationStub(), new ValidationStub()]
  const sut = new ValidationComposite(validations)

  return { sut, validations }
}

describe('Validation Composite', () => {
  test('Should return null if all validations were successful', () => {
    const { sut } = makeSut()

    const validationError = sut.validate({})

    expect(validationError).toBeNull()
  })

  test('Should return an error if any validation failed', () => {
    const { sut, validations } = makeSut()

    jest.spyOn(validations[1], 'validate').mockReturnValueOnce(new Error('any_error'))

    const validationError = sut.validate({})

    expect(validationError).toEqual(new Error('any_error'))
  })
})
