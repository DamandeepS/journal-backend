import { RequestHandler } from 'express'
import { TokenExpiredError, verify } from 'jsonwebtoken'
import { ObjectId } from 'mongoose'
import { UserModal } from '../models/UsersModel'

export interface DecodedToken {
  user_id: ObjectId
  email: string
}

export const verifyToken: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]
  if (token == null) {
    return res.status(403).send('A token is required for authentication')
  }
  try {
    const userDecoded = verify(token, process.env.TOKEN_KEY ?? 'temp-token') as DecodedToken
    if ((await UserModal.findById(userDecoded.user_id) != null)) {
      res.locals.user = userDecoded
    } else {
      return res.status(401).send({ message: 'Token Invalid or User doesn\'t exist' })
    }
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).send({ message: 'Token Expired' })
    }
    return res.status(401).send({ message: 'Token Invalid' })
  }
  return next()
}
