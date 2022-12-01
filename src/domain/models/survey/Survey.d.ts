import SurveyAnswer from './SurveyAnswer'

export default interface Survey {
  question: string
  answers: SurveyAnswer[]
}
