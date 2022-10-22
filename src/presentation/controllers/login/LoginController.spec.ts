import Controller from '../../protocols/Controller'
import LoginController from './LoginController'
import HttpHelper from '../../helpers/HttpHelper'
import MissingParamError from '../../errors/MissingParamError'

interface SutTypes {
  sut: Controller
}

const makeSut = (): SutTypes => ({
  sut: new LoginController()
})

describe('Login Controller', () => {
  test('Should return 400 if no e-mail is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: { password: 'any_password' }
    })

    expect(httpResponse).toEqual(HttpHelper.badRequest(new MissingParamError('email')))
  })
})
