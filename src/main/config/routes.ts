import { Application, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export const setupRoutes = (app: Application): void => {
  const router = Router()
  app.use('/api', router)

  const routesPath = path.resolve(__dirname, '..', 'routes')
  readdirSync(routesPath).map(async file => {
    if (!file.includes('.test.')) {
      (await import(path.join(routesPath, file))).default(router)
    }
  })
}
