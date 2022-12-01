import { AddSurvey } from '../../../../domain/usecases/survey/AddSurvey'
import DbAddSurvey from '../../../../data/usecases/add-survey/DbAddSurvey'
import SurveyMongoRepository from '../../../../infra/db/mongodb/survey-repository/SurveyMongoRepository'

const DbAddSurveyFactory = {
  makeDbAddSurvey (): AddSurvey {
    const addSurveyRepository = new SurveyMongoRepository()
    return new DbAddSurvey(addSurveyRepository)
  }
}

export default DbAddSurveyFactory
