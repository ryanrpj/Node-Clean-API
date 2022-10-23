import Validation from './Validation'

export default class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}

  validate (input: any): Error | null {
    return null
  }
}
