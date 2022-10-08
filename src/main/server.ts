import app from './config/app'
import env from './config/env'

app.listen(env.serverPort, () => console.log(`Server running at http://localhost:${env.serverPort}.`))
