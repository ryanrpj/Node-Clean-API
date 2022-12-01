import { Collection } from 'mongodb'
import MongoHelper from '../helpers/MongoHelper'
import env from '../../../../main/config/env'
import SurveyMongoRepository from './SurveyMongoRepository'
import { AddSurveyModel } from '../../../../domain/usecases/survey/AddSurvey'

interface SutTypes {
  sut: SurveyMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new SurveyMongoRepository()

  return { sut }
}

const makeAddSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{ image: 'any_image', answer: 'any_answer' }]
})

describe('SurveyMongoRepository', () => {
  let collection: Collection

  beforeAll(async () => await MongoHelper.connect(env.mongoUrl))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    collection = MongoHelper.getCollection('surveys')
    await collection.deleteMany({})
  })

  test('Should return a survey on add success', async () => {
    const { sut } = makeSut()
    const survey = makeAddSurvey()

    await sut.add(survey)

    const createdSurvey = await collection.findOne({ question: survey.question })
    expect(createdSurvey).toBeTruthy()
  })
})
