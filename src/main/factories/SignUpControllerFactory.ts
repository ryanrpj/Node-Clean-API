import SignUpController from '../../presentation/controllers/signup/SignUpController'
import EmailValidatorAdapter from '../../utils/EmailValidatorAdapter'
import DbAddAccount from '../../data/usecases/add-account/DbAddAccount'
import BcryptAdapter from '../../infra/criptography/BcryptAdapter'
import AccountMongoRepository from '../../infra/db/mongodb/account-repository/AccountMongoRepository'
import LogControllerDecorator from '../decorators/LogControllerDecorator'
import Controller from '../../presentation/protocols/Controller'
import LogMongoRepository from '../../infra/db/mongodb/log-repository/LogMongoRepository'

const SignUpControllerFactory = {
  makeSignUpController (): Controller {
    const salt = 12
    const encrypter = new BcryptAdapter(salt)
    const addAccountRepository = new AccountMongoRepository()
    const addAccount = new DbAddAccount(encrypter, addAccountRepository)
    const emailValidator = new EmailValidatorAdapter()
    const signUpController = new SignUpController(emailValidator, addAccount)
    const errorLogRepository = new LogMongoRepository()
    return new LogControllerDecorator(signUpController, errorLogRepository)
  }
}

export default SignUpControllerFactory
