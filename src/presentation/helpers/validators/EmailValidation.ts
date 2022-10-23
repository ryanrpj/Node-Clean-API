import Validation from './Validation'
import EmailValidator from '../../protocols/EmailValidator'
import InvalidParamError from '../../errors/InvalidParamError'

export default class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | null {
    return this.emailValidator.isValid(input[this.fieldName])
      ? null
      : new InvalidParamError(this.fieldName)
  }
}
