import HttpRequest from '../../protocols/HttpRequest'
import Validation from '../../protocols/Validation'
import AddSurveyController from './AddSurveyController'

class ValidationStub implements Validation {
  validate (input: any): Error | null {
    return null
  }
}

interface SutTypes {
  sut: AddSurveyController
  validation: Validation
}

const makeSut = (): SutTypes => {
  const validation = new ValidationStub()
  const sut = new AddSurveyController(validation)
  return { sut, validation }
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
})
