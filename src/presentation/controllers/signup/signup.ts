import { AddAccount } from '../../../domain/usecases/add-account'
import Controller from '../../protocols/controller'
import EmailValidator from '../../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import MissingParamError from '../../errors/missing-param-error'
import InvalidParamError from '../../errors/invalid-param-error'
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
    } catch (error: any) {
      return serverError(error)
    }
  }
}
