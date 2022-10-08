import { Application, Router } from 'express'
import * as fs from 'fs'
import path from 'path'

export const setupRoutes = (app: Application): void => {
  const router = Router()
  app.use('/api', router)

  const routesPath = path.resolve(__filename, '..', '..', 'routes')
  const routesFiles = fs.readdirSync(routesPath).filter(fileName => fileName.endsWith('routes.ts'))

  routesFiles.forEach(async fileName => (await import(path.join(routesPath, fileName))).default(router))
}
