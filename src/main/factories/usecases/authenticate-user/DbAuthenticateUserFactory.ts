import BcryptAdapter from '../../../../infra/criptography/BcryptAdapter'
import AccountMongoRepository from '../../../../infra/db/mongodb/account-repository/AccountMongoRepository'
import DbAuthenticateUser from '../../../../data/usecases/authenticate-user/DbAuthenticateUser'
import JwtAdapter from '../../../../infra/criptography/JwtAdapter'
import AuthenticateUser from '../../../../domain/usecases/authentication/AuthenticateUser'
import env from '../../../config/env'

const DbAuthenticateUserFactory = {
  makeDbAuthenticateUser (): AuthenticateUser {
    const getAccountByEmailRepository = new AccountMongoRepository()
    const hashComparer = new BcryptAdapter(12)
    const encrypter = new JwtAdapter(env.jwtSecret)
    return new DbAuthenticateUser(getAccountByEmailRepository, hashComparer, encrypter)
  }
}

export default DbAuthenticateUserFactory
