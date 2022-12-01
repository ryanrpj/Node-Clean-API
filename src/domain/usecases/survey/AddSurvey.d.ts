import Survey from '../../models/survey/Survey'

export default interface AddSurvey {
  add: (survey: Survey) => Promise<void>
}
