import request from 'supertest'
import app from '../config/app'
import MongoHelper from '../../infra/db/mongodb/helpers/MongoHelper'
import env from '../config/env'
import { Collection, ObjectId } from 'mongodb'
import { AddSurveyModel } from '../../domain/usecases/survey/AddSurvey'
import { sign } from 'jsonwebtoken'

const makeSurvey = (): AddSurveyModel => ({
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

describe('SignUp Routes', () => {
  let collection: Collection

  beforeAll(async () => await MongoHelper.connect(env.mongoUrl))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    collection = MongoHelper.getCollection('surveys')
    await collection.deleteMany({})
  })

  test('Should return 403 on add survey without Bearer token', async () => {
    await request(app)
      .post('/api/surveys')
      .send(makeSurvey())
      .expect(403)
  })

  test('Should return 403 on add survey with invalid Bearer token', async () => {
    await request(app)
      .post('/api/surveys')
      .set('Authentication', 'any_token')
      .send(makeSurvey())
      .expect(403)
  })

  test('Should return 403 on add survey with valid Bearer token without admin privileges', async () => {
    const userId = 'd5efaeeba6b83763fc624048'
    await collection.insertOne({
      _id: new ObjectId(userId),
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })

    const authToken = sign(userId, env.jwtSecret)

    await request(app)
      .post('/api/surveys')
      .set('Authentication', authToken)
      .send(makeSurvey())
      .expect(403)
  })
})
