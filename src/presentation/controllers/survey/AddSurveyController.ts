import Controller from '../../protocols/Controller'
import HttpRequest from '../../protocols/HttpRequest'
import HttpResponse from '../../protocols/HttpResponse'
import Validation from '../../protocols/Validation'
import HttpHelper from '../../helpers/http/HttpHelper'

export default class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const validationError = this.validation.validate(request.body)

    if (validationError) {
      return HttpHelper.badRequest(validationError)
    }

    return null as any
  }
}
