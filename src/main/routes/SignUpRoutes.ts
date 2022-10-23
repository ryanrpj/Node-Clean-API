import { Router } from 'express'
import SignUpControllerFactory from '../factories/signup/SignUpControllerFactory'
import ExpressRouteAdapter from '../adapters/ExpressRouteAdapter'

const registerSignUpRoutes = (router: Router): void => {
  router.post('/signup', ExpressRouteAdapter(SignUpControllerFactory.makeSignUpController()))
}

export default registerSignUpRoutes
