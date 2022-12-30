import Survey from '../../models/survey/Survey'

export interface AddSurvey {
  add: (survey: AddSurveyModel) => Promise<Survey>
}

export interface AddSurveyModel {
  question: string
  answers: AddSurveyAnswer[]
}

interface AddSurveyAnswer {
  image?: string
  answer: string
}
