import express from 'express'

const SERVER_PORT = 8080

const app = express()

app.listen(SERVER_PORT, () => console.log(`Server running at http://localhost:${SERVER_PORT}.`))
