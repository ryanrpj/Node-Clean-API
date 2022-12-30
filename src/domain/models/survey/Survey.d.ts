export default interface Survey {
  id: string
  question: string
  answers: SurveyAnswer[]
}

interface SurveyAnswer {
  image?: string
  answer: string
}
