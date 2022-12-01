import DbAddSurvey from './DbAddSurvey'
import AddSurveyRepository from '../../protocols/db/AddSurveyRepository'
import { AddSurveyModel } from '../../../domain/usecases/survey/AddSurvey'
import Survey from '../../../domain/models/survey/Survey'

class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add (survey: AddSurveyModel): Promise<Survey> {
    return { id: 'valid_id', ...survey }
  }
}

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepository: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepository = new AddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepository)

  return { sut, addSurveyRepository }
}

const makeAddSurvey = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{ image: 'any_image', answer: 'any_answer' }]
})

describe('DbAddSurvey', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepository } = makeSut()
    const survey = makeAddSurvey()
    const addSpy = jest.spyOn(addSurveyRepository, 'add')

    await sut.add(survey)
    expect(addSpy).toHaveBeenCalledWith(survey)
  })

  test('Should return a survey if AddSurveyRepository succeeds', async () => {
    const { sut } = makeSut()
    const survey = makeAddSurvey()

    const createdSurvey = await sut.add(survey)
    expect(createdSurvey).toEqual({ id: 'valid_id', ...survey })
  })
})
