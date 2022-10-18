import ServerError from '../errors/ServerError'
import HttpResponse from '../protocols/HttpResponse'

const HttpHelper = {
  badRequest (error: Error): HttpResponse {
    return { statusCode: 400, body: error }
  },

  serverError (error: Error): HttpResponse {
    return { statusCode: 500, body: new ServerError(error) }
  },

  created (body: any): HttpResponse {
    return { statusCode: 201, body }
  }
}

export default HttpHelper
