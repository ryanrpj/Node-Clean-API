import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../erros/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password']

    for (const requiredParam of requiredFields) {
      if (!httpRequest.body[requiredParam]) { return badRequest(new MissingParamError(requiredParam)) }
    }

    return {
      statusCode: 200,
      body: {}
    }
  }
}
