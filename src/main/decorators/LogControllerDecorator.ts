import Controller from '../../presentation/protocols/Controller'
import ErrorLogRepository from '../../data/protocols/ErrorLogRepository'
import HttpResponse from '../../presentation/protocols/HttpResponse'
import HttpRequest from '../../presentation/protocols/HttpRequest'

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
