import Controller from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http'
import ErrorLogRepository from '../../data/protocols/error-log-repository'

export default class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly errorLogRepository: ErrorLogRepository

  constructor (controller: Controller, errorLogRepository: ErrorLogRepository) {
    this.controller = controller
    this.errorLogRepository = errorLogRepository
  }

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(request)

    if (response.statusCode === 500) {
      await this.errorLogRepository.logError(response.body.stack)
    }

    return response
  }
}
