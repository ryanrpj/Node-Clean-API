import MongoHelper from '../helpers/MongoHelper'
import AccountMongoRepository from './AccountMongoRepository'
import env from '../../../../main/config/env'
import { Collection } from 'mongodb'

describe('Account Mongo Repository', () => {
  let collection: Collection

  beforeAll(async () => await MongoHelper.connect(env.mongoUrl))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    collection = MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })

  test('Should return an account on add success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'hashed_password'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email')
    expect(account.password).toBe('hashed_password')
  })

  test('Should return an account on getByEmail success', async () => {
    const sut = new AccountMongoRepository()
    const { insertedId } = await collection.insertOne({
      name: 'any_name',
      email: 'any_email',
      password: 'hashed_password'
    })

    const account = await sut.getByEmail('any_email')

    expect(account).toBeTruthy()
    expect(account.id).toStrictEqual(insertedId)
    expect(account.name).toStrictEqual('any_name')
    expect(account.email).toStrictEqual('any_email')
    expect(account.password).toStrictEqual('hashed_password')
  })

  test('Should return null if getByEmail does not find an account', async () => {
    const sut = new AccountMongoRepository()

    const account = await sut.getByEmail('any_email')
    expect(account).toBeNull()
  })

  test('Should return an account on getById success', async () => {
    const sut = new AccountMongoRepository()
    const { insertedId } = await collection.insertOne({
      name: 'any_name',
      email: 'any_email',
      password: 'hashed_password'
    })

    const account = await sut.getById(insertedId.toString())

    expect(account).toBeTruthy()
    expect(account.id).toStrictEqual(insertedId)
    expect(account.name).toStrictEqual('any_name')
    expect(account.email).toStrictEqual('any_email')
    expect(account.password).toStrictEqual('hashed_password')
  })

  test('Should return null if getById does not find an account', async () => {
    const sut = new AccountMongoRepository()

    const account = await sut.getById('639f79f7d862b19fcfe1e64a')
    expect(account).toBeNull()
  })
})
