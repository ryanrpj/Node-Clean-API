import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './controller'

interface SutTypes {
  sut: LogControllerDecorator
  controller: Controller
}

class ControllerStub implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: 200,
      body: { ok: 'ok' }
    }
  }
}

const makeSut = (): SutTypes => {
  const controller = new ControllerStub()
  const sut = new LogControllerDecorator(controller)
  return { controller, sut }
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
})
