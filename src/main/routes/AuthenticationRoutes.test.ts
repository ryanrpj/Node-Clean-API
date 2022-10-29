import request from 'supertest'
import app from '../config/app'
import MongoHelper from '../../infra/db/mongodb/helpers/MongoHelper'
import env from '../config/env'
import { Collection } from 'mongodb'
import bcrypt from 'bcrypt'

describe('SignUp Routes', () => {
  let collection: Collection

  beforeAll(async () => await MongoHelper.connect(env.mongoUrl))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    collection = MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })

  test('Should return 201 on signup success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Ryan Ribeiro',
        email: 'test@ryanribeiro.dev',
        password: '@RyanRPJ.'
      })
      .expect(201)
  })

  test('Should return 200 on login success', async () => {
    await collection.insertOne({
      name: 'Ryan Ribeiro',
      email: 'test@ryanribeiro.dev',
      password: await bcrypt.hash('@RyanRPJ.', 12)
    })

    await request(app)
      .post('/api/login')
      .send({
        email: 'test@ryanribeiro.dev',
        password: '@RyanRPJ.'
      })
      .expect(200)
  })
})
