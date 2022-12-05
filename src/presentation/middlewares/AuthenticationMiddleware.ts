import Middleware from '../protocols/Middleware'
import HttpRequest from '../protocols/HttpRequest'
import HttpResponse from '../protocols/HttpResponse'
import HttpHelper from '../helpers/http/HttpHelper'
import ForbiddenError from '../errors/ForbiddenError'
import GetAccountByToken from '../../domain/usecases/authentication/GetAccountByToken'

export default class AuthenticationMiddleware implements Middleware {
  constructor (
    private readonly getAccountByToken: GetAccountByToken,
    private readonly role?: string
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const authToken = request?.headers?.['x-access-token']

      if (authToken) {
        await this.getAccountByToken.getByToken(authToken, this.role)
      }

      return HttpHelper.forbidden(new ForbiddenError())
    } catch (error: any) {
      return HttpHelper.serverError(error)
    }
  }
}
