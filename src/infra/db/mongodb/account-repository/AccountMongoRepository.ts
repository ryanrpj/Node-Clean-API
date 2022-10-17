import AddAccountRepository from '../../../../data/protocols/AddAccountRepository'
import { AddAccountModel } from '../../../../domain/usecases/AddAccount'
import AccountModel from '../../../../domain/models/Account'
import MongoHelper from '../helpers/MongoHelper'

export default class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const collection = MongoHelper.getCollection('accounts')
    const { insertedId } = await collection.insertOne(account)
    const insertedAccount = await collection.findOne({ _id: insertedId })

    delete insertedAccount?.password

    return MongoHelper.map<AccountModel>(insertedAccount)
  }
}
