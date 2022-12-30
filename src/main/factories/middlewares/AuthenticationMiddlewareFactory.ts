import GetAccountByTokenFactory from '../usecases/load-account-by-token/DbGetAccountByTokenFactory'
import AuthenticationMiddleware from '../../../presentation/middlewares/AuthenticationMiddleware'

const AuthenticationMiddlewareFactory = {
  makeAuthenticationMiddleware (role?: string): AuthenticationMiddleware {
    const getAccountByToken = GetAccountByTokenFactory.makeGetAccountByToken()
    return new AuthenticationMiddleware(getAccountByToken, role)
  }
}

export default AuthenticationMiddlewareFactory
