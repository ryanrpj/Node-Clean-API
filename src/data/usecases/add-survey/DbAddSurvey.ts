import { AddSurvey, AddSurveyModel } from '../../../domain/usecases/survey/AddSurvey'
import Survey from '../../../domain/models/survey/Survey'
import AddSurveyRepository from '../../protocols/db/AddSurveyRepository'

export default class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) {}

  async add (survey: AddSurveyModel): Promise<Survey> {
    return await this.addSurveyRepository.add(survey)
  }
}
