import { Schema, model } from 'mongoose'
import { getDate } from '../utils/create-date'

export enum TAGS {'GOOD' = 'GOOD', 'BAD' = 'BAD', 'NORMAL' = 'NORMAL', 'WEIRD_BUT_GOOD' = 'WEIRD_BUT_GOOD', 'SIMPLY_WEIRD' = 'SIMPLY_WEIRD', 'WEIRD_AND_BAD' = 'WEIRD_AND_BAD', 'BRAINFUCK' = 'BRAINFUCK', 'SAD' = 'SAD', 'LONELY' = 'LONELY', 'EXCITED' = 'EXCITED', 'TIRED' = 'TIRED', 'EUPHORIC' = 'EUPHORIC'}

export const JournalSchema = new Schema({
  _id: {
    type: String,
    default: getDate(new Date())
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  tags: {
    type: Array<TAGS>,
    default: [TAGS.NORMAL]
  },
  personId: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
})

export const JournalModel = model('journal', JournalSchema)
