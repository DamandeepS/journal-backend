import { Document } from 'mongoose'
import { TAGS } from '../models/JournalModel'

export interface NormalizedDocument {
  title: string
  description: string
  date: string
  tags: TAGS[]
}

export const normalizeDocument = (obj: Document | undefined | null): NormalizedDocument | null => obj == null
  ? null
  : ({
      title: obj.get('title') as string,
      description: obj.get('description') as string,
      date: obj.get('date') as string,
      tags: obj.get('tags') as TAGS[]
    })
