import { AddAccount } from '../../../domain/usecases/AddAccount'
import Controller from '../../protocols/Controller'
import HttpHelper from '../../helpers/HttpHelper'
import HttpResponse from '../../protocols/HttpResponse'
import HttpRequest from '../../protocols/HttpRequest'
import Validation from '../../protocols/Validation'

export default class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)

      if (validationError) {
        return HttpHelper.badRequest(validationError)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({ name, email, password })

      return HttpHelper.created(account)
    } catch (error: any) {
      return HttpHelper.serverError(error)
    }
  }
}
