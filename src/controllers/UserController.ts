
import { compare, hash } from 'bcryptjs'
import { RequestHandler } from 'express'
import { sign } from 'jsonwebtoken'
import { DecodedToken } from '../middleware/authenticateUser'
import { JournalModel } from '../models/JournalModel'
import { UserModal } from '../models/UsersModel'
const User = UserModal

interface LoginPayload {
  email: string | undefined
  password: string | undefined
}

interface LoginResponse {
  token: string
  firstName: string
  lastName: string
  email: string
}

export const login: RequestHandler<unknown, LoginResponse | { message: string }, LoginPayload> = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!((email != null) && (password != null) && email !== '' && password !== '')) {
      return res.status(400).send({
        message: 'Bad Request - Missing fields'
      })
    }

    const user = await User.findOne({ email })
    if ((user != null) && (password != null) && Boolean(await compare(password, user.encryptedPassword))) {
      const token = sign({
        user_id: user._id,
        email
      },
      process.env.TOKEN_KEY ?? 'temp-token', {
        expiresIn: '2h'
      })
      res.status(200).json({ token, email: user.email, firstName: user.firstName, lastName: user.lastName })
    } else {
      res.status(401).json({
        message: 'Incorrect Credentials'
      })
    }
  } catch {
    res.status(401).json({
      message: 'Incorrect Credentials'
    })
  }
}

interface RegisterPayload {
  email: string | undefined
  password: string | undefined
  firstName: string | undefined
  lastName: string | undefined
}

interface RegisterResponse {
  token: string
  firstName: string
  lastName: string
  email: string
}

export const register: RequestHandler<unknown, RegisterResponse | { message: string }, RegisterPayload> = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body

    if (!((firstName != null) && (lastName != null) && (email != null) && (password != null))) {
      res.status(400).send({
        message: 'Bad Request - Missing fields'
      })
    }
    const oldUser = await User.findOne({ email })
    if (oldUser != null) {
      return res.status(409).send({
        message: 'User Already Exist. Please Login'
      })
    }

    const encryptedPassword = await hash(password ?? '', 10)
    const user = new User({
      firstName,
      lastName,
      email: email?.toLowerCase(), // sanitize: convert email to lowercase
      encryptedPassword
    })

    await user.save()

    const token = sign({
      user_id: user._id,
      email
    },
    process.env.TOKEN_KEY as string ?? 'temp-token', {
      expiresIn: '2h'
    }
    )

    return res.status(200).json({ token, email: user.email, firstName: user.firstName, lastName: user.lastName })
  } catch (e) {
    return res.status(401).json({ message: JSON.stringify(e) })
  }
}

export const deleteAccount: RequestHandler = async (req, res) => {
  try {
    const { user_id: personId } = res.locals.user as DecodedToken
    await User.findByIdAndDelete(personId)
    await JournalModel.deleteMany({
      personId
    })
    res.status(200).json({
      message: 'Account and associated data removed'
    })
  } catch {
    res.status(500).json({
      message: 'Error occured while deleting data'
    })
  }
}
