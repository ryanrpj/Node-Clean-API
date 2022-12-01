import { Router } from 'express'
import ExpressRouteAdapter from '../adapters/ExpressRouteAdapter'
import AddSurveyControllerFactory from '../factories/controllers/survey/AddSurveyControllerFactory'

const surveysRoutes = (router: Router): void => {
  router.post('/surveys', ExpressRouteAdapter(AddSurveyControllerFactory.makeAddSurveyController()))
}

export default surveysRoutes
