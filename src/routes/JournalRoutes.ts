import { addNew, deleteEntry, jounal, showAll, update } from '../controllers/JournalController'
import { AppType } from '../server'
import cors from 'cors'

export default function (app: AppType): void {
  app.route('/journal')
    .get(cors(), showAll)
    .post(cors(), addNew)

  app.route('/journal/:journalId')
    .get(cors(), jounal)
    .delete(cors(), deleteEntry)
    .put(cors(), update)
}
