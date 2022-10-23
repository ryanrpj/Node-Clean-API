import Controller from '../../protocols/Controller'
import HttpRequest from '../../protocols/HttpRequest'
import HttpResponse from '../../protocols/HttpResponse'
import HttpHelper from '../../helpers/HttpHelper'
import AuthenticateUser from '../../../domain/usecases/AuthenticateUser'
import Validation from '../../protocols/Validation'

export default class LoginController implements Controller {
  constructor (
    private readonly authenticateUser: AuthenticateUser,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)

      if (validationError) {
        return HttpHelper.badRequest(validationError)
      }

      const { email, password } = httpRequest.body
      const authToken = await this.authenticateUser.auth({ email, password })

      if (authToken.length === 0) {
        return HttpHelper.unauthorized()
      }

      return HttpHelper.ok({ access_token: authToken })
    } catch (error: any) {
      return HttpHelper.serverError(error)
    }
  }
}
