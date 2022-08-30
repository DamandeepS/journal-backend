import { Document } from 'mongoose'
import { TAGS } from '../models/JournalModel'

export interface NormalizedDocument {
  title: string
  description: string
  date: string
  tags: TAGS[]
  modified: string
}

const MAX_LENGTH_FOR_TITLE = 80
const MAX_LENGTH_FOR_DESCRIPTION = 300

const processString = (string: string, limit: number, shouldProcess: boolean): string => shouldProcess ? string.substring(0, limit) : string

export const normalizeDocument = (obj: Document | undefined | null, trunc = false): NormalizedDocument | null => obj == null
  ? null
  : ({
      title: processString(obj.get('title') as string, MAX_LENGTH_FOR_TITLE, trunc),
      description: processString(obj.get('description') as string, MAX_LENGTH_FOR_DESCRIPTION, trunc),
      date: obj.get('date') as string,
      tags: obj.get('tags') as TAGS[],
      modified: obj.get('modified') as string
    })
