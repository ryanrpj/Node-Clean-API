import { Router } from 'express'
import SignUpControllerFactory from '../factories/controllers/signup/SignUpControllerFactory'
import ExpressRouteAdapter from '../adapters/ExpressRouteAdapter'
import LoginControllerFactory from '../factories/controllers/login/LoginControllerFactory'

const authenticationRoutes = (router: Router): void => {
  router.post('/signup', ExpressRouteAdapter(SignUpControllerFactory.makeSignUpController()))
  router.post('/login', ExpressRouteAdapter(LoginControllerFactory.makeLoginController()))
}

export default authenticationRoutes
