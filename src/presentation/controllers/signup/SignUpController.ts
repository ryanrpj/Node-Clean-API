import { AddAccount } from '../../../domain/usecases/AddAccount'
import Controller from '../../protocols/Controller'
import EmailValidator from '../../protocols/EmailValidator'
import MissingParamError from '../../errors/MissingParamError'
import InvalidParamError from '../../errors/InvalidParamError'
import HttpHelper from '../../helpers/HttpHelper'
import HttpResponse from '../../protocols/HttpResponse'
import HttpRequest from '../../protocols/HttpRequest'
import Validation from '../../helpers/validators/Validation'

export default class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)

    const requiredFields = ['name', 'email', 'password']

    for (const requiredParam of requiredFields) {
      if (!httpRequest.body[requiredParam]) { return HttpHelper.badRequest(new MissingParamError(requiredParam)) }
    }

    try {
      const { name, email, password } = httpRequest.body
      if (!this.emailValidator.isValid(email)) {
        return HttpHelper.badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({ name, email, password })

      return HttpHelper.created(account)
    } catch (error: any) {
      return HttpHelper.serverError(error)
    }
  }
}
