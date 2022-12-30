import { Router } from 'express'
import ExpressRouteAdapter from '../adapters/ExpressRouteAdapter'
import AddSurveyControllerFactory from '../factories/controllers/survey/AddSurveyControllerFactory'
import ExpressMiddlewareAdapter from '../adapters/ExpressMiddlewareAdapter'
import AuthenticationMiddlewareFactory from '../factories/middlewares/AuthenticationMiddlewareFactory'

const surveysRoutes = (router: Router): void => {
  const authMiddleware = ExpressMiddlewareAdapter(
    AuthenticationMiddlewareFactory.makeAuthenticationMiddleware('admin')
  )

  router.post('/surveys', authMiddleware, ExpressRouteAdapter(AddSurveyControllerFactory.makeAddSurveyController()))
}

export default surveysRoutes
