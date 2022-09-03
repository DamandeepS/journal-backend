/* eslint-disable @typescript-eslint/no-base-to-string */
// this disable is required because for some reason TS thinks this will cause issue, but it is working fine
import { RequestHandler } from 'express'
import { DecodedToken } from '../middleware/authenticateUser'
import { JournalModel, TAGS } from '../models/JournalModel'
import { NormalizedDocument, normalizeDocument } from '../utils/normalize-document'

const Journal = JournalModel

interface MongoError {
  keyPattern?: {[propName: string]: string | number} | undefined | null
}

export const showAll: RequestHandler = async (req, res) => {
  try {
    const { limit } = { ...req.params, limit: '30' }
    const { user_id: personId } = res.locals.user as DecodedToken
    const results = await Journal.find({
      personId
    }).sort({ date: -1 }).limit(parseInt(limit))
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

interface JournalPayload {
  title: string
  description: string
  date: string
  tags: string
  modified: unknown
}

export const addNew: RequestHandler<unknown, NormalizedDocument | { message: string }, JournalPayload> = async (req, res) => {
  const { date } = {
    date: new Date().toISOString().substring(0, 10),
    ...(req.body as { date?: string | undefined})
  }

  delete req.body.modified
  try {
    if (new Date() < new Date(date)) {
      return res.status(400).json({ message: 'Cannot add entries in advance' })
    }
    const { user_id: personId } = res.locals.user as DecodedToken
    const newJournalEntry = new Journal({ ...req.body, tags: req.body.tags.split(',') as TAGS[], personId, _id: `${date.substring(0, 10)}${personId.toString()}` })
    const result = await newJournalEntry.save()
    return res.json(normalizeDocument(result) as NormalizedDocument)
  } catch (e) {
    const error: MongoError = e as MongoError
    console.log(e)
    if (typeof error.keyPattern?._id !== 'undefined') {
      return res.status(409).json({
        message: `Entry already added for ${date}`
      })
    } else { return res.status(400).json({ message: 'Failed to add new entry ' }) }
  }
}

export const update: RequestHandler<{ journalId: string }, NormalizedDocument | { message: string }, JournalPayload> = async (req, res) => {
  try {
    const { user_id: personId } = res.locals.user as DecodedToken
    delete req.body.modified
    const entry = await Journal.findOne({
      _id: `${req.params.journalId}${personId.toString()}`,
      personId
    })

    if (new Date() < new Date(req.body.date)) {
      return res.status(400).json({ message: 'Cannot add entries in advance' })
    }
    const result = await Journal.findOneAndUpdate({
      _id: `${req.params.journalId}${personId.toString()}`,
      personId
    },
    {
      ...(req.body),
      date: entry?.date ?? new Date(),
      tags: req.body.tags.split(',') as TAGS[],
      modified: new Date()
    },
    { new: true }
    )
    return res.json(normalizeDocument(result) as NormalizedDocument)
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
