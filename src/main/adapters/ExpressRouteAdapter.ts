import Controller from '../../presentation/protocols/Controller'
import { Request, Response } from 'express'
import HttpRequest from '../../presentation/protocols/HttpRequest'

const ExpressRouteAdapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request: HttpRequest = {
      body: req.body
    }

    const response = await controller.handle(request)

    if (response.statusCode.toString().match(/2\d{2}/)) {
      res.status(response.statusCode).send(response.body)
    } else {
      res.status(response.statusCode).send({
        error: response.body.message
      })
    }
  }
}

export default ExpressRouteAdapter
