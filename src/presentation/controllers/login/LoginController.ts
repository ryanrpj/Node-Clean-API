import Controller from '../../protocols/Controller'
import HttpRequest from '../../protocols/HttpRequest'
import HttpResponse from '../../protocols/HttpResponse'
import HttpHelper from '../../helpers/HttpHelper'
import MissingParamError from '../../errors/MissingParamError'
import EmailValidator from '../../protocols/EmailValidator'
import InvalidParamError from '../../errors/InvalidParamError'

export default class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredParams = ['email', 'password']

    for (const param of requiredParams) {
      if (!httpRequest.body[param]) {
        return HttpHelper.badRequest(new MissingParamError(param))
      }
    }

    const { email } = httpRequest.body

    try {
      if (!this.emailValidator.isValid(email)) {
        return HttpHelper.badRequest(new InvalidParamError('email'))
      }
    } catch (error: any) {
      return HttpHelper.serverError(error)
    }

    return 0 as any
  }
}
