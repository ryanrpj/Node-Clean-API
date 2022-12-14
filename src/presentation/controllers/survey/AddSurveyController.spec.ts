import HttpRequest from '../../protocols/HttpRequest'
import Validation from '../../protocols/Validation'
import AddSurveyController from './AddSurveyController'
import HttpHelper from '../../helpers/http/HttpHelper'
import { AddSurvey, AddSurveyModel } from '../../../domain/usecases/survey/AddSurvey'
import Survey from '../../../domain/models/survey/Survey'

class ValidationStub implements Validation {
  validate (input: any): Error | null {
    return null
  }
}

class AddSurveyStub implements AddSurvey {
  async add (survey: AddSurveyModel): Promise<Survey> {
    return await Promise.resolve({ id: 'any_id', ...survey })
  }
}

interface SutTypes {
  sut: AddSurveyController
  validation: Validation
  addSurvey: AddSurvey
}

const makeSut = (): SutTypes => {
  const validation = new ValidationStub()
  const addSurvey = new AddSurveyStub()
  const sut = new AddSurveyController(validation, addSurvey)
  return { sut, validation, addSurvey }
}

const makeHttpRequest = (): HttpRequest => {
  return {
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  }
}

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validation } = makeSut()
    const validateSpy = jest.spyOn(validation, 'validate')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validation } = makeSut()
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new Error('Invalid answer'))
    const httpRequest = makeHttpRequest()
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(HttpHelper.badRequest(new Error('Invalid answer')))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurvey } = makeSut()
    const addSpy = jest.spyOn(addSurvey, 'add')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 201 if AddSurvey succeeds', async () => {
    const { sut } = makeSut()

    const httpRequest = makeHttpRequest()
    const response = await sut.handle(httpRequest)

    const { question, answers } = httpRequest.body

    const createdSurvey = { id: 'any_id', question, answers }

    expect(response).toEqual(HttpHelper.created(createdSurvey))
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurvey } = makeSut()

    jest.spyOn(addSurvey, 'add').mockImplementationOnce(async () => {
      throw new Error('Add survey error')
    })

    const httpRequest = makeHttpRequest()
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(HttpHelper.serverError(new Error()))
  })
})
