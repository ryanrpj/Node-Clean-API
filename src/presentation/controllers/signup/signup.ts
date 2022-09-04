import { AddAccount } from '../../../domain/usecases'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from './signup-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, created, serverError } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name', 'email', 'password']

    for (const requiredParam of requiredFields) {
      if (!httpRequest.body[requiredParam]) { return badRequest(new MissingParamError(requiredParam)) }
    }

    try {
      const { name, email, password } = httpRequest.body
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({ name, email, password })

      return created(account)
    } catch (_) {
      return serverError()
    }
  }
}
