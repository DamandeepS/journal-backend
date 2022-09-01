import { addNew, deleteEntry, jounal, showAll, update } from '../controllers/JournalController'
import { changePassword, deleteAccount, editAccount, login, register } from '../controllers/UserController'
import { AppType } from '../server'
import { verifyToken } from '../middleware/authenticateUser'
import cors, { CorsOptions } from 'cors'

const corsOptions: CorsOptions = {
  credentials: true,
  origin: '*'
}

export default function (app: AppType): void {
  app.route('/journal')
    .get(cors(corsOptions), verifyToken, showAll)
    .post(cors(corsOptions), verifyToken, addNew)
    .options(cors())

  app.route('/journal/:journalId')
    .get(cors(corsOptions), verifyToken, jounal)
    .delete(cors(corsOptions), verifyToken, deleteEntry)
    .put(cors(corsOptions), verifyToken, update)
    .options(cors())

  app.route('/login')
    .post(cors(corsOptions), login)
    .options(cors())

  app.route('/register')
    .post(cors(corsOptions), register)
    .options(cors())

  app.route('/account')
    .delete(cors(corsOptions), verifyToken, deleteAccount)
    .put(cors(corsOptions), verifyToken, editAccount)
    .options(cors())

  app.route('/account/change-password')
    .put(cors(corsOptions), verifyToken, changePassword)
    .options(cors())
}
