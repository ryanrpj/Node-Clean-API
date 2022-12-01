import SignUpController from '../../../../presentation/controllers/authentication/signup/SignUpController'
import DbAddAccount from '../../../../data/usecases/add-account/DbAddAccount'
import BcryptAdapter from '../../../../infra/criptography/BcryptAdapter'
import AccountMongoRepository from '../../../../infra/db/mongodb/account-repository/AccountMongoRepository'
import LogControllerDecorator from '../../../decorators/LogControllerDecorator'
import Controller from '../../../../presentation/protocols/Controller'
import LogMongoRepository from '../../../../infra/db/mongodb/log-repository/LogMongoRepository'
import SignUpValidationCompositeFactory from './SignUpValidationCompositeFactory'
import DbAuthenticateUserFactory from '../../usecases/authenticate-user/DbAuthenticateUserFactory'

const SignUpControllerFactory = {
  makeSignUpController (): Controller {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const validationComposite = SignUpValidationCompositeFactory.makeSignUpValidationComposite()
    const authenticateUser = DbAuthenticateUserFactory.makeDbAuthenticateUser()
    const errorLogRepository = new LogMongoRepository()

    const addAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
    const signUpController = new SignUpController(addAccount, validationComposite, authenticateUser)
    return new LogControllerDecorator(signUpController, errorLogRepository)
  }
}

export default SignUpControllerFactory
