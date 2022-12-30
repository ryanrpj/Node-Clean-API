import Controller from '../../protocols/Controller'
import HttpRequest from '../../protocols/HttpRequest'
import HttpResponse from '../../protocols/HttpResponse'
import Validation from '../../protocols/Validation'
import HttpHelper from '../../helpers/http/HttpHelper'
import { AddSurvey } from '../../../domain/usecases/survey/AddSurvey'

export default class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request.body)

      if (validationError) {
        return HttpHelper.badRequest(validationError)
      }

      const { question, answers } = request.body

      const createdSurvey = await this.addSurvey.add({ question, answers })

      return HttpHelper.created(createdSurvey)
    } catch (error: any) {
      return HttpHelper.serverError(error)
    }
  }
}
