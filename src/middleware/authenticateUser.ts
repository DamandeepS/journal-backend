import { RequestHandler } from 'express'
import { verify } from 'jsonwebtoken'

export const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]
  if (token == null) {
    return res.status(403).send('A token is required for authentication')
  }
  try {
    res.locals.user = verify(token, process.env.TOKEN_KEY ?? 'temp-token')
  } catch (err) {
    console.error(err)
    return res.status(401).send('Invalid Token')
  }
  return next()
}
