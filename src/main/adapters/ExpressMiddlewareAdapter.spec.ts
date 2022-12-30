import Middleware from '../../presentation/protocols/Middleware'
import HttpRequest from '../../presentation/protocols/HttpRequest'
import HttpResponse from '../../presentation/protocols/HttpResponse'
import ExpressMiddlewareAdapter from './ExpressMiddlewareAdapter'
import HttpHelper from '../../presentation/helpers/http/HttpHelper'

interface SutTypes {
  sut: any
  middleware: Middleware
}

class MiddlewareStub implements Middleware {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    return { statusCode: 200, body: { ok: 'ok' } }
  }
}

const makeSut = (): SutTypes => {
  const middleware = new MiddlewareStub()
  const sut = ExpressMiddlewareAdapter(middleware)

  return { sut, middleware }
}

const makeRequest = (): HttpRequest => ({
  headers: { anyKey: 'any_value' },
  body: { anyInput: 'any_value' }
})

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

const makeNext = (): any => () => {}

describe('Express Middleware Adapter', () => {
  it('Should call middleware to handle the request', async () => {
    const { sut, middleware } = makeSut()
    const handleSpy = jest.spyOn(middleware, 'handle')

    const request = makeRequest()
    await sut(request, makeResponse(), makeNext())

    expect(handleSpy).toHaveBeenCalledWith(request)
  })

  it('Should assign middleware return value to request body when success', async () => {
    const { sut } = makeSut()

    const request = makeRequest()
    await sut(request, makeResponse(), makeNext())

    expect(request.body.ok).toBe('ok')
    expect(request.body.anyInput).toBe('any_value')
  })

  it('Should return an error if middleware return status code is not 2xx', async () => {
    const { sut, middleware } = makeSut()
    jest.spyOn(middleware, 'handle').mockImplementationOnce(async () => HttpHelper.serverError(new Error()))

    const response = makeResponse()
    await sut(makeRequest(), response, makeNext())

    expect(response.statusCode).toBe(500)
  })
})
