/* eslint-disable @typescript-eslint/no-base-to-string */
// this disable is required because for some reason TS thinks this will cause issue, but it is working fine

import { RequestHandler } from 'express'
import { DecodedToken } from '../middleware/authenticateUser'
import { JournalModel, JournalSchema } from '../models/JournalModel'
import { getDate } from '../utils/create-date'
import { normalizeDocument } from '../utils/normalize-document'

const Journal = JournalModel

interface MongoError {
  keyPattern?: {[propName: string]: string | number} | undefined | null
}

export const showAll: RequestHandler = async (_, res) => {
  try {
    const { user_id: personId } = res.locals.user as DecodedToken
    const results = await Journal.find({
      personId
    })
    res.json(results.map(result => normalizeDocument(result, true)))
  } catch (e) {
    res.status(400).json(e)
  }
}

export const jounal: RequestHandler = async (req, res) => {
  try {
    const { user_id: personId } = res.locals.user as DecodedToken
    const result = await Journal.findOne({
      _id: `${req.params.journalId}${personId.toString()}`,
      personId
    })
    res.json(normalizeDocument(result))
  } catch (e) {
    res.status(404).json(e)
  }
}

export const addNew: RequestHandler = async (req, res) => {
  try {
    const { user_id: personId } = res.locals.user as DecodedToken
    const newJournalEntry = new Journal({ ...req.body, personId, _id: `${getDate(new Date())}${personId.toString()}` })
    const result = await newJournalEntry.save()
    res.json(normalizeDocument(result))
  } catch (e) {
    const error: MongoError = e as MongoError
    if (typeof error.keyPattern?._id !== 'undefined') {
      res.status(403).json({
        error: 'Entry already added for today',
        code: 401
      })
    } else { res.status(400).json({ e: 'failed' }) }
  }
}

export const update: RequestHandler = async (req, res) => {
  try {
    const { user_id: personId } = res.locals.user as DecodedToken
    const result = await Journal.findOneAndUpdate({
      _id: `${req.params.journalId}${personId.toString()}`,
      personId
    },
    (req.body) as typeof JournalSchema,
    { new: true }
    )
    res.json(normalizeDocument(result))
  } catch {
    res.status(400)
  }
}
export const deleteEntry: RequestHandler = async (req, res) => {
  try {
    const { user_id: personId } = res.locals.user as DecodedToken
    const result = await Journal.findOneAndDelete({
      _id: `${req.params.journalId}${personId.toString()}`,
      personId
    }
    )
    res.json(normalizeDocument(result))
  } catch {
    res.status(400)
  }
}
