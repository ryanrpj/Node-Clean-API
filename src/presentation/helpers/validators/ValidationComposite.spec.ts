import Validation from './Validation'
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
})
