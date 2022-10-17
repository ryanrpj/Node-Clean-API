import request from 'supertest'
import app from '../config/app'
import MongoHelper from '../../infra/db/mongodb/helpers/MongoHelper'
import env from '../config/env'

describe('SignUp Routes', () => {
  beforeAll(async () => await MongoHelper.connect(env.mongoUrl))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const collection = MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Ryan Ribeiro',
        email: 'test@ryanribeiro.dev',
        password: '@RyanRPJ.'
      })
      .expect(201)
  })
})
