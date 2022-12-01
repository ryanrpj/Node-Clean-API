import { AddSurveyModel } from '../../../domain/usecases/survey/AddSurvey'
import Survey from '../../../domain/models/survey/Survey'

export default interface AddSurveyRepository {
  add: (survey: AddSurveyModel) => Promise<Survey>
}
