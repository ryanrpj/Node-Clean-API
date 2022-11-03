import BcryptAdapter from '../../../infra/criptography/BcryptAdapter'
import AccountMongoRepository from '../../../infra/db/mongodb/account-repository/AccountMongoRepository'
import LogControllerDecorator from '../../decorators/LogControllerDecorator'
import Controller from '../../../presentation/protocols/Controller'
import LogMongoRepository from '../../../infra/db/mongodb/log-repository/LogMongoRepository'
import LoginController from '../../../presentation/controllers/login/LoginController'
import DbAuthenticateUser from '../../../data/usecases/authenticate-user/DbAuthenticateUser'
import JwtAdapter from '../../../infra/criptography/JwtAdapter'
import LoginValidationCompositeFactory from './LoginValidationCompositeFactory'

const LoginControllerFactory = {
  makeLoginController (): Controller {
    const getAccountByEmailRepository = new AccountMongoRepository()
    const hashComparer = new BcryptAdapter(12)
    const encrypter = new JwtAdapter('dummy_secret')
    const authenticateUser = new DbAuthenticateUser(getAccountByEmailRepository, hashComparer, encrypter)
    const validationComposite = LoginValidationCompositeFactory.makeLoginUpValidationComposite()
    const signUpController = new LoginController(authenticateUser, validationComposite)
    const errorLogRepository = new LogMongoRepository()
    return new LogControllerDecorator(signUpController, errorLogRepository)
  }
}

export default LoginControllerFactory
