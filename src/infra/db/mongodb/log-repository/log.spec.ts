import MongoHelper from '../helpers/mongo-helper'
import env from '../../../../main/config/env'
import { Collection } from 'mongodb'
import LogMongoRepository from './log'

describe('Log Error Mongo Repository', () => {
  let collection: Collection

  beforeAll(async () => await MongoHelper.connect(env.mongoUrl))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    collection = MongoHelper.getCollection('logs-errors')
    await collection.deleteMany({})
  })

  test('Should insert an error into the errors collection', async () => {
    expect(await collection.countDocuments()).toBe(0)

    const sut = new LogMongoRepository()
    await sut.logError('any_stack')

    expect(await collection.countDocuments()).toBe(1)

    const insertedError = await collection.findOne()
    expect(insertedError).not.toBeNull()
    expect(insertedError?.stack).toBe('any_stack')
    expect(insertedError?.at).toBeTruthy()
  })
})
