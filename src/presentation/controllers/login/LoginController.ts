import Controller from '../../protocols/Controller'
import HttpRequest from '../../protocols/HttpRequest'
import HttpResponse from '../../protocols/HttpResponse'
import HttpHelper from '../../helpers/HttpHelper'
import MissingParamError from '../../errors/MissingParamError'
import EmailValidator from '../../protocols/EmailValidator'
import InvalidParamError from '../../errors/InvalidParamError'
import AuthenticateUser from '../../../domain/usecases/AuthenticateUser'

export default class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authenticateUser: AuthenticateUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredParams = ['email', 'password']

    for (const param of requiredParams) {
      if (!httpRequest.body[param]) {
        return HttpHelper.badRequest(new MissingParamError(param))
      }
    }

    const { email, password } = httpRequest.body

    try {
      if (!this.emailValidator.isValid(email)) {
        return HttpHelper.badRequest(new InvalidParamError('email'))
      }

      const authResult = await this.authenticateUser.auth(email, password)

      if (!authResult.isAuthenticated()) {
        return HttpHelper.unauthorized()
      }
    } catch (error: any) {
      return HttpHelper.serverError(error)
    }

    return 0 as any
  }
}
