import Controller from '../../protocols/Controller'
import HttpRequest from '../../protocols/HttpRequest'
import HttpResponse from '../../protocols/HttpResponse'
import HttpHelper from '../../helpers/HttpHelper'
import MissingParamError from '../../errors/MissingParamError'

export default class LoginController implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    return await Promise.resolve(HttpHelper.badRequest(new MissingParamError('email')))
  }
}
