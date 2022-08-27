import { json, urlencoded } from 'body-parser'
import { connect } from 'mongoose'
import express from 'express'
import journalRoutes from './routes/JournalRoutes'
import path from 'path'
import { writeCert } from './utils/write-cert'

const app = express()
const port = process.env.PORT ?? 3000
const mongoDBInstance = process.env.MONGO_DB_INSTANCE ?? 'mongodb://localhost/local'

export type AppType = typeof app

const certLocation = path.join(__dirname, 'cert.pem')

void (async () => {
  try {
    let options = {}

    try {
      await writeCert(certLocation)
      options = {
        sslCert: path.join(__dirname, '..', 'X509-cert-1617159834613023775.pem')
      }
    } catch {
      console.error('Failed to add the certificate')
    }
    await connect(mongoDBInstance, options)
    app.use(urlencoded({ extended: true }))
    app.use(json())

    journalRoutes(app)

    app.listen(port)
    console.log(`todo list RESTful API server started on: ${port}`)
  } catch (e) {
    console.trace(e)
  }
})()
