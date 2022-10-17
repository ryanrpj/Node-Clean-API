import Controller from '../../presentation/protocols/Controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http'
import LogControllerDecorator from './LogControllerDecorator'
import ErrorLogRepository from '../../data/protocols/ErrorLogRepository'
import HttpHelper from '../../presentation/helpers/HttpHelper'

interface SutTypes {
  sut: LogControllerDecorator
  controller: Controller
  errorLogRepository: ErrorLogRepository
}

class ControllerStub implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: 200,
      body: { ok: 'ok' }
    }
  }
}

class ErrorLogRepositoryStub implements ErrorLogRepository {
  async logError (stack: string): Promise<void> {}
}

const makeSut = (): SutTypes => {
  const controller = new ControllerStub()
  const errorLogRepository = new ErrorLogRepositoryStub()
  const sut = new LogControllerDecorator(controller, errorLogRepository)
  return { controller, sut, errorLogRepository }
}

describe('Log Controller Decorator', () => {
  test('Should call controller with correct parameters', async () => {
    const { sut, controller } = makeSut()
    const handleSpy = jest.spyOn(controller, 'handle')

    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return whatever controller returns', async () => {
    const { sut } = makeSut()

    const anyRequest = {}

    const response = await sut.handle(anyRequest)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({ ok: 'ok' })
  })

  test('Should call ErrorLogRepository when Controller returns 500', async () => {
    const { sut, controller, errorLogRepository } = makeSut()

    const error = new Error()
    error.stack = 'any_stack'

    jest.spyOn(controller, 'handle').mockReturnValueOnce(Promise.resolve(HttpHelper.serverError(error)))

    const logSpy = jest.spyOn(errorLogRepository, 'logError')

    const anyRequest = {}

    await sut.handle(anyRequest)

    expect(logSpy).toHaveBeenCalledWith(error.stack)
  })
})
