import { json, urlencoded } from 'body-parser'
import { connect } from 'mongoose'
import express from 'express'
import journalRoutes from './routes/JournalRoutes'

const app = express()
const port = process.env.PORT ?? 3000
const mongoDBInstance = process.env.MONGO_DB_INSTANCE ?? 'mongodb://localhost/local'

export type AppType = typeof app

void (async () => await connect(mongoDBInstance))()

app.use(urlencoded({ extended: true }))
app.use(json())

journalRoutes(app)

app.listen(port)

console.log(`todo list RESTful API server started on: ${port}`)
