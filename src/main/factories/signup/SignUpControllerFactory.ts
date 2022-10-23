import SignUpController from '../../../presentation/controllers/signup/SignUpController'
import DbAddAccount from '../../../data/usecases/add-account/DbAddAccount'
import BcryptAdapter from '../../../infra/criptography/BcryptAdapter'
import AccountMongoRepository from '../../../infra/db/mongodb/account-repository/AccountMongoRepository'
import LogControllerDecorator from '../../decorators/LogControllerDecorator'
import Controller from '../../../presentation/protocols/Controller'
import LogMongoRepository from '../../../infra/db/mongodb/log-repository/LogMongoRepository'
import SignUpValidationCompositeFactory from './SignUpValidationCompositeFactory'

const SignUpControllerFactory = {
  makeSignUpController (): Controller {
    const salt = 12
    const hasher = new BcryptAdapter(salt)
    const addAccountRepository = new AccountMongoRepository()
    const addAccount = new DbAddAccount(hasher, addAccountRepository)
    const validationComposite = SignUpValidationCompositeFactory.makeSignUpValidationComposite()
    const signUpController = new SignUpController(addAccount, validationComposite)
    const errorLogRepository = new LogMongoRepository()
    return new LogControllerDecorator(signUpController, errorLogRepository)
  }
}

export default SignUpControllerFactory
