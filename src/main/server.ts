import app from './config/app'

const SERVER_PORT = 8080

app.listen(SERVER_PORT, () => console.log(`Server running at http://localhost:${SERVER_PORT}.`))
