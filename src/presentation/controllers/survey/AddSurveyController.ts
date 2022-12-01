import Controller from '../../protocols/Controller'
import HttpRequest from '../../protocols/HttpRequest'
import HttpResponse from '../../protocols/HttpResponse'
import Validation from '../../protocols/Validation'

export default class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(request.body)
    return null as any
  }
}
