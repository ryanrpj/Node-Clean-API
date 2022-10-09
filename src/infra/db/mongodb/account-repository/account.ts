import { AccountModel, AddAccountModel, AddAccountRepository } from './account-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    const collection = MongoHelper.getCollection('accounts')
    const { insertedId } = await collection.insertOne(account)
    const insertedAccount = await collection.findOne({ _id: insertedId })

    delete insertedAccount?.password

    return MongoHelper.map<AccountModel>(insertedAccount)
  }
}
