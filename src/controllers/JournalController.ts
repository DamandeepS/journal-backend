
import { RequestHandler } from 'express'
import { JournalModel, JournalSchema } from '../models/JournalModel'

const Journal = JournalModel

interface MongoError {
  keyPattern?: {[propName: string]: string | number} | undefined | null
}

export const showAll: RequestHandler = async (_, res) => {
  try {
    res.json(await Journal.find({}))
  } catch (e) {
    res.status(400).json(e)
  }
}

export const jounal: RequestHandler = async (req, res) => {
  try {
    res.json(await Journal.findById(req.params.journalId))
  } catch (e) {
    res.status(404).json(e)
  }
}

export const addNew: RequestHandler = async (req, res) => {
  try {
    const newJournalEntry = new Journal(req.body)
    const result = await newJournalEntry.save()
    res.json(result)
  } catch (e) {
    const error: MongoError = e as MongoError
    if (typeof error.keyPattern?._id !== 'undefined') {
      res.status(403).json({
        error: 'Entry already added for today',
        code: 401
      })
    } else { res.status(400).json(e) }
  }
}

export const update: RequestHandler = async (req, res) => {
  try {
    const result = await Journal.findOneAndUpdate({
      _id: req.params.journalId
    },
    (req.body) as typeof JournalSchema,
    { new: true }
    )
    res.json(result)
  } catch {
    res.status(400)
  }
}
export const deleteEntry: RequestHandler = async (req, res) => {
  try {
    const result = await Journal.findOneAndDelete({
      _id: req.params.journalId
    }
    )
    res.json(result)
  } catch {
    res.status(400)
  }
}
