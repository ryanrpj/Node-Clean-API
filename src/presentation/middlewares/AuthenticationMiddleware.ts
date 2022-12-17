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
      const authToken = /Bearer (.*)/.exec(request?.headers?.Authentication)?.[1]

      if (!authToken) {
        return HttpHelper.forbidden(new ForbiddenError())
      }

      const account = await this.getAccountByToken.getByToken(authToken, this.role)

      if (!account) {
        return HttpHelper.forbidden(new ForbiddenError())
      }

      return HttpHelper.ok(account)
    } catch (error: any) {
      return HttpHelper.serverError(error)
    }
  }
}
