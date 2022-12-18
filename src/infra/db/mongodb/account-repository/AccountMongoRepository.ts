import AddAccountRepository from '../../../../data/protocols/db/AddAccountRepository'
import { AddAccountModel } from '../../../../domain/usecases/authentication/AddAccount'
import AccountModel from '../../../../domain/models/authentication/Account'
import MongoHelper from '../helpers/MongoHelper'
import GetAccountByEmailRepository from '../../../../data/protocols/db/GetAccountByEmailRepository'
import GetAccountByIdRepository from '../../../../data/protocols/db/GetAccountByIdRepository'

export default class AccountMongoRepository implements AddAccountRepository, GetAccountByEmailRepository, GetAccountByIdRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const collection = MongoHelper.getCollection('accounts')
    const { insertedId } = await collection.insertOne(account)
    const insertedAccount = await collection.findOne({ _id: insertedId })

    return MongoHelper.map<AccountModel>(insertedAccount)
  }

  async getByEmail (email: string): Promise<AccountModel> {
    const collection = MongoHelper.getCollection('accounts')
    const accountFromDb: any = await collection.findOne({ email })

    return accountFromDb && MongoHelper.map<AccountModel>(accountFromDb)
  }

  async getById (id: string, role?: string | undefined): Promise<AccountModel | null> {
    const collection = MongoHelper.getCollection('accounts')
    const accountFromDb: any = await collection.findOne({
      _id: MongoHelper.buildObjectId(id),
      $or: [
        { role }, { role: 'admin' }
      ]
    })

    return accountFromDb && MongoHelper.map<AccountModel>(accountFromDb)
  }
}
