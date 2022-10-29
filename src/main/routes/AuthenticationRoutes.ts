import { Router } from 'express'
import SignUpControllerFactory from '../factories/signup/SignUpControllerFactory'
import ExpressRouteAdapter from '../adapters/ExpressRouteAdapter'
import LoginControllerFactory from '../factories/login/LoginControllerFactory'

const authenticationRoutes = (router: Router): void => {
  router.post('/signup', ExpressRouteAdapter(SignUpControllerFactory.makeSignUpController()))
  router.post('/login', ExpressRouteAdapter(LoginControllerFactory.makeLoginController()))
}

export default authenticationRoutes
