import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect if connection is down', async () => {
    const firstCollectionRetrieval = await sut.getCollection('account')
    expect(firstCollectionRetrieval).toBeTruthy()

    await sut.disconnect()

    const secondCollectionRetrieval = await sut.getCollection('account')
    expect(secondCollectionRetrieval).toBeTruthy()
  })
})
