import { model, Schema } from 'mongoose'

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  encryptedPassword: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    unique: true
  },
  lastName: {
    type: String,
    required: true
  }
})

export const UserModal = model('Users', UserSchema)
