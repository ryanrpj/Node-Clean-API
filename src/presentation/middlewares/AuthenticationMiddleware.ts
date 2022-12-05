import Middleware from '../protocols/Middleware'
import HttpRequest from '../protocols/HttpRequest'
import HttpResponse from '../protocols/HttpResponse'
import HttpHelper from '../helpers/http/HttpHelper'
import ForbiddenError from '../errors/ForbiddenError'

export default class AuthenticationMiddleware implements Middleware {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    return await Promise.resolve(HttpHelper.forbidden(new ForbiddenError()))
  }
}
