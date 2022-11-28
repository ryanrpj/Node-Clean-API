import { AddAccount } from '../../../domain/usecases/AddAccount'
import Controller from '../../protocols/Controller'
import HttpHelper from '../../helpers/http/HttpHelper'
import HttpResponse from '../../protocols/HttpResponse'
import HttpRequest from '../../protocols/HttpRequest'
import Validation from '../../protocols/Validation'
import AuthenticateUser from '../../../domain/usecases/AuthenticateUser'
import EmailAlreadyInUseError from '../../errors/EmailAlreadyInUseError'

export default class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authenticateUser: AuthenticateUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)

      if (validationError) {
        return HttpHelper.badRequest(validationError)
      }

      const { name, email, password } = httpRequest.body

      const createdAccount = await this.addAccount.add({ name, email, password })

      if (!createdAccount) {
        return HttpHelper.forbidden(new EmailAlreadyInUseError())
      }

      const authToken = await this.authenticateUser.auth({ email, password })

      return HttpHelper.created({ access_token: authToken })
    } catch (error: any) {
      return HttpHelper.serverError(error)
    }
  }
}
