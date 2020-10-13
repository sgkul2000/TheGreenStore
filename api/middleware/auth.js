const jwt = require('jsonwebtoken')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const dotenv = require('dotenv')
const User = require('../routes/models/userModel')
dotenv.config()

function authenticateToken (req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers.authorization
  // const token = authHeader.split(' ')[1] || authHeader
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) {
    return res.status(401).send({
      auth: false,
      error: 'Unauthorized'
    })
  } // if there isn't any token
  jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
    // console.log(err)
    if (err) { return res.sendStatus(403) }
    req.user = user
    next() // pass the execution off to whatever request the client intended
  })
}

function authenticateTokenAdmin (req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers.authorization
  // const token = authHeader && authHeader.split(' ')[1]
  const token = authHeader.split(' ')[1] || authHeader
  if (token == null) {
    return res.status(401).send({
      auth: false,
      error: 'Unauthorized'
    })
  } // if there isn't any token
  jwt.verify(token, process.env.PRIVATE_KEY, (err, user) => {
    // console.log(err)
    if (err) { return res.sendStatus(403) }
    if (user.isAdmin) {
      req.user = user
      next()
    } else {
      return res.sendStatus(403)
    }
  })
}

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const user = await User.create({
          fullname: req.body.fullname,
          email,
          password,
          phone: req.body.phone,
          username: req.body.username,
          referralCode: 'null'
        })

        return done(null, user)
      } catch (error) {
        done(error)
      }
    }
  )
)

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        var criteria = (!email.includes('@')) ? { username: email } : { email }
        const user = await User.findOne(criteria)

        if (!user) {
          return done(null, false, { message: 'User not found' })
        }

        const validate = await user.isValidPassword(password)

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' })
        }
        return done(null, user, { message: 'Logged in Successfully' })
      } catch (error) {
        console.error(error)
        return done(error)
      }
    }
  )
)
passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.PRIVATE_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    (token, done) => {
      try {
        return done(null, token.user)
      } catch (error) {
        done(error)
      }
    }
  )
)

function authenticateAdmin (req, res, next) {
  if (req.user.isAdmin) {
    next()
  } else {
    res.status(401).send({
      status: false,
      error: 'Unauthorized user.'
    })
  }
}

module.exports = { authenticateToken, authenticateTokenAdmin, authenticateAdmin }
