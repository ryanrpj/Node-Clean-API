import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { ErrorLogRepository } from '../../data/protocols/error-log-repository'

export class LogControllerDecorator implements Controller {
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
