import GetAccountByToken from '../../../../domain/usecases/authentication/GetAccountByToken'
import DbGetAccountByToken from '../../../../data/usecases/get-account-by-token/DbGetAccountByToken'
import JwtAdapter from '../../../../infra/criptography/JwtAdapter'
import env from '../../../config/env'
import AccountMongoRepository from '../../../../infra/db/mongodb/account-repository/AccountMongoRepository'

const GetAccountByTokenFactory = {
  makeGetAccountByToken (): GetAccountByToken {
    const decrypter = new JwtAdapter(env.jwtSecret)
    const getAccountByIdRepository = new AccountMongoRepository()
    return new DbGetAccountByToken(decrypter, getAccountByIdRepository)
  }
}

export default GetAccountByTokenFactory
