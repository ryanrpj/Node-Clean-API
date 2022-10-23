import Validation from './Validation'
import EmailValidator from '../../protocols/EmailValidator'

export default class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | null {
    return null
  }
}
