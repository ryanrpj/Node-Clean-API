import Validation from '../../protocols/Validation'
import MissingParamError from '../../errors/MissingParamError'

export default class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error | null {
    return input[this.fieldName] ? null : new MissingParamError(this.fieldName)
  }
}
