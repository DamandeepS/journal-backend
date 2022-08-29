/* eslint-disable @typescript-eslint/no-base-to-string */
// this disable is required because for some reason TS thinks this will cause issue, but it is working fine

import { RequestHandler } from 'express'
import { DecodedToken } from '../middleware/authenticateUser'
import { JournalModel, JournalSchema } from '../models/JournalModel'
import { normalizeDocument } from '../utils/normalize-document'

const Journal = JournalModel

interface MongoError {
  keyPattern?: {[propName: string]: string | number} | undefined | null
}

export const showAll: RequestHandler = async (req, res) => {
  try {
    const { limit } = req.params
    const { user_id: personId } = res.locals.user as DecodedToken
    const results = await Journal.find({
      personId
    }).limit(parseInt(limit))
    return res.json(results.map(result => normalizeDocument(result, true)))
  } catch (e) {
    return res.status(400).json(e)
  }
}

export const jounal: RequestHandler = async (req, res) => {
  try {
    const { user_id: personId } = res.locals.user as DecodedToken
    const result = await Journal.findOne({
      _id: `${req.params.journalId}${personId.toString()}`,
      personId
    })
    return res.json(normalizeDocument(result))
  } catch (e) {
    return res.status(404).json(e)
  }
}

export const addNew: RequestHandler = async (req, res) => {
  const { date } = {
    date: new Date().toISOString().substring(0, 10),
    ...(req.body as { date?: string | undefined})
  }
  try {
    const { user_id: personId } = res.locals.user as DecodedToken
    const newJournalEntry = new Journal({ ...req.body, personId, _id: `${date}${personId.toString()}` })
    const result = await newJournalEntry.save()
    return res.json(normalizeDocument(result))
  } catch (e) {
    const error: MongoError = e as MongoError
    if (typeof error.keyPattern?._id !== 'undefined') {
      return res.status(409).json({
        message: `Entry already added for ${date}`,
        code: 409
      })
    } else { return res.status(400).json({ message: 'Failed to add new entry ', stack: e }) }
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
    return res.json(normalizeDocument(result))
  } catch {
    return res.status(400).json({
      message: 'Failed to update the entry'
    })
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
    return res.json(normalizeDocument(result))
  } catch {
    return res.status(400).json({
      message: 'Failed to delete the entry'
    })
  }
}
