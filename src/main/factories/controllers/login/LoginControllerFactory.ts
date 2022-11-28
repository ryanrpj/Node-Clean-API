import LogControllerDecorator from '../../../decorators/LogControllerDecorator'
import Controller from '../../../../presentation/protocols/Controller'
import LogMongoRepository from '../../../../infra/db/mongodb/log-repository/LogMongoRepository'
import LoginController from '../../../../presentation/controllers/login/LoginController'
import LoginValidationCompositeFactory from './LoginValidationCompositeFactory'
import DbAuthenticateUserFactory from '../../usecases/authenticate-user/DbAuthenticateUserFactory'

const LoginControllerFactory = {
  makeLoginController (): Controller {
    const authenticateUser = DbAuthenticateUserFactory.makeDbAuthenticateUser()
    const validationComposite = LoginValidationCompositeFactory.makeLoginUpValidationComposite()
    const signUpController = new LoginController(authenticateUser, validationComposite)
    const errorLogRepository = new LogMongoRepository()
    return new LogControllerDecorator(signUpController, errorLogRepository)
  }
}

export default LoginControllerFactory
