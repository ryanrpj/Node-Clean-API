import BcryptAdapter from '../../../../infra/criptography/BcryptAdapter'
import AccountMongoRepository from '../../../../infra/db/mongodb/account-repository/AccountMongoRepository'
import DbAuthenticateUser from '../../../../data/usecases/authenticate-user/DbAuthenticateUser'
import JwtAdapter from '../../../../infra/criptography/JwtAdapter'
import AuthenticateUser from '../../../../domain/usecases/AuthenticateUser'

const DbAuthenticateUserFactory = {
  makeDbAuthenticateUser (): AuthenticateUser {
    const getAccountByEmailRepository = new AccountMongoRepository()
    const hashComparer = new BcryptAdapter(12)
    const encrypter = new JwtAdapter('dummy_secret')
    return new DbAuthenticateUser(getAccountByEmailRepository, hashComparer, encrypter)
  }
}

export default DbAuthenticateUserFactory
