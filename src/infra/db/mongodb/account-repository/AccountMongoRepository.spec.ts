import MongoHelper from '../helpers/MongoHelper'
import AccountMongoRepository from './AccountMongoRepository'
import env from '../../../../main/config/env'

describe('Account Mongo Repository', () => {
  beforeAll(async () => await MongoHelper.connect(env.mongoUrl))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const collection = MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })

  test('Should return an account on add success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })

    expect(account).toBeDefined()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email')
  })
})
