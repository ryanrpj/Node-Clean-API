import Controller from '../../presentation/protocols/Controller'
import HttpRequest from '../../presentation/protocols/HttpRequest'
import HttpResponse from '../../presentation/protocols/HttpResponse'
import ExpressRouteAdapter from './ExpressRouteAdapter'

class ControllerStub implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    return { body: { ok: 'ok' }, statusCode: 200 }
  }
}

const makeSut = (): any => ExpressRouteAdapter(new ControllerStub())

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
    const sut = makeSut()

    const response = makeResponse()

    await sut({} as any, response)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({ ok: 'ok' })
  })
})
