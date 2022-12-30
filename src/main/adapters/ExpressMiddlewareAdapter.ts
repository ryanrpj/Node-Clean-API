import { NextFunction, Request, Response } from 'express'
import HttpRequest from '../../presentation/protocols/HttpRequest'
import Middleware from '../../presentation/protocols/Middleware'

const ExpressMiddlewareAdapter = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request: HttpRequest = {
      body: req.body,
      headers: req.headers
    }

    const response = await middleware.handle(request)

    if (response.statusCode.toString().match(/2\d{2}/)) {
      Object.assign(req.body, response.body)
      next()
    } else {
      res.status(response.statusCode).send({
        error: response.body.message
      })
    }
  }
}

export default ExpressMiddlewareAdapter
