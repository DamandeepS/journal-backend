import { addNew, deleteEntry, jounal, showAll, update } from '../controllers/JournalController'
import { login, register } from '../controllers/UserController'
import { AppType } from '../server'
import cors, { CorsOptions } from 'cors'

const corsOptions: CorsOptions = {
  credentials: true
}

export default function (app: AppType): void {
  app.route('/journal')
    .get(cors(corsOptions), showAll)
    .post(cors(corsOptions), addNew)
    .options(cors())

  app.route('/journal/:journalId')
    .get(cors(corsOptions), jounal)
    .delete(cors(corsOptions), deleteEntry)
    .put(cors(corsOptions), update)
    .options(cors())

  app.route('/login')
    .post(cors(corsOptions), login)
    .options(cors())

  app.route('/register')
    .post(cors(corsOptions), register)
    .options(cors())
}
