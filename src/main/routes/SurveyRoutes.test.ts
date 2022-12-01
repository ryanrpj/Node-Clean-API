import request from 'supertest'
import app from '../config/app'
import MongoHelper from '../../infra/db/mongodb/helpers/MongoHelper'
import env from '../config/env'
import { Collection } from 'mongodb'

describe('SignUp Routes', () => {
  let collection: Collection

  beforeAll(async () => await MongoHelper.connect(env.mongoUrl))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    collection = MongoHelper.getCollection('surveys')
    await collection.deleteMany({})
  })

  test('Should return 201 on add survey success', async () => {
    await request(app)
      .post('/api/surveys')
      .send({
        question: 'What should I write here?',
        answers: [
          {
            image: 'js-logo.com',
            answer: 'JavaScript is awesome!'
          },
          {
            answer: 'But TypeScript is fancier!'
          }
        ]
      })
      .expect(201)
  })
})
