import { json, urlencoded } from 'body-parser'
import { connect, ConnectOptions } from 'mongoose'
import express from 'express'
import journalRoutes from './routes/JournalRoutes'
import path from 'path'
import { writeCert } from './utils/write-cert'
import { config } from 'dotenv'

config()

const app = express()
const port = process.env.PORT ?? 3000
const mongoDBInstance = process.env.MONGO_DB_INSTANCE ?? 'mongodb://localhost/local'

export type AppType = typeof app

const certLocation = {
  certificate: path.join(__dirname, 'cert.cert'),
  privateKey: path.join(__dirname, 'private_key.key')
}

void (async () => {
  try {
    let options: ConnectOptions = {}

    try {
      await writeCert(certLocation)
      options = {
        sslCert: certLocation.certificate,
        sslKey: certLocation.privateKey,
        sslValidate: true
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
