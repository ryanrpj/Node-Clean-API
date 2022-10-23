import Controller from '../../presentation/protocols/Controller'
import HttpRequest from '../../presentation/protocols/HttpRequest'
import HttpResponse from '../../presentation/protocols/HttpResponse'
import ExpressRouteAdapter from './ExpressRouteAdapter'
import HttpHelper from '../../presentation/helpers/HttpHelper'

class ControllerStub implements Controller {
  async handle (_: HttpRequest): Promise<HttpResponse> {
    return { body: { ok: 'ok' }, statusCode: 200 }
  }
}

interface SutTypes {
  sut: any
  controller: Controller
}

const makeSut = (): SutTypes => {
  const controller = new ControllerStub()
  const expressRouteAdapter = ExpressRouteAdapter(controller)

  return {
    controller,
    sut: expressRouteAdapter
  }
}

const makeResponse = (): any => ({
  statusCode: 0,
  body: {},

  status (newStatus: number) {
    this.statusCode = newStatus
    return this
  },

  send (payload: any) {
    this.body = payload
    return this
  }
})

describe('Express Route Adapter', () => {
  test('Should return whatever controller returns when status code is 2xx', async () => {
    const { sut } = makeSut()

    const response = makeResponse()

    await sut({} as any, response)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({ ok: 'ok' })
  })

  test('Should return error message when controller returns any status code other than 2xx', async () => {
    const { sut, controller } = makeSut()

    const response = makeResponse()

    const error = new Error()
    error.message = 'any_message'

    const handleSpy = jest.spyOn(controller, 'handle')
    handleSpy.mockReturnValueOnce(Promise.resolve(HttpHelper.badRequest(error)))

    await sut({} as any, response)

    expect(response.statusCode).toBe(400)
    expect(response.body).toMatchObject({ error: 'any_message' })
  })
})
