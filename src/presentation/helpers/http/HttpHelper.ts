import ServerError from '../../errors/ServerError'
import HttpResponse from '../../protocols/HttpResponse'
import UnauthorizedError from '../../errors/UnauthorizedError'

const HttpHelper = {
  badRequest (error: Error): HttpResponse {
    return { statusCode: 400, body: error }
  },

  serverError (error: Error): HttpResponse {
    return { statusCode: 500, body: new ServerError(error) }
  },

  ok (body: any): HttpResponse {
    return { statusCode: 200, body }
  },

  created (body: any): HttpResponse {
    return { statusCode: 201, body }
  },

  unauthorized (): HttpResponse {
    return { statusCode: 401, body: new UnauthorizedError() }
  }
}

export default HttpHelper
