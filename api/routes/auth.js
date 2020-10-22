/*  eslint-disable no-console */
const nodemailer = require('nodemailer')
const express = require('express')
const router = express.Router()
const passport = require('passport')

const jwt = require('jsonwebtoken')
const Bcrypt = require('bcrypt')
// const auth = require('../middleware/auth')
const User = require('../db/models/userModel')
const adminRoutes = require('./admin')

router.use('/admin', adminRoutes)

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  (req, res, next) => {
    res.json({
      message: 'Signup successful',
      user: req.user
    })
  }
)

router.post(
  '/login',
  (req, res, next) => {
    passport.authenticate(
      'login',
      (err, user, info) => {
        try {
          if (err || !user) {
            const error = new Error('An error occurred.')

            return next(error)
          }
          req.login(
            user,
            { session: false },
            (error) => {
              if (error) { return next(error) }

              const body = { _id: user._id, email: user.email, isAdmin: user.isAdmin, username: user.username, fullname: user.fullname, phone: user.phone, referralVode: user.referralCode }
              const token = jwt.sign({ user: body }, process.env.PRIVATE_KEY, { expiresIn: '3 days' })

              return res.json({ token })
            }
          )
        } catch (error) {
          return next(error)
        }
      }
    )(req, res, next)
  }
)

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOne({
    email: req.user.email
  })
    .select('-password')
    .exec(async (err, user) => {
      if (err) {
        console.error(err)
        return res.status(400).send({
          success: false,
          error: err
        })
      }
      await user.populate('orders')
      await user.populate('addresses').execPopulate()
      console.log(user)
      res.send({
        success: true,
        user
      })
    })
})

router.put('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findOne({ email: req.user.email }, (err, user) => {
    console.log(user)
    if (err) {
      console.error(err)
      return res.status(400).send({
        success: false,
        error: err
      })
    }
    if (req.body.fullname) {
      user.fullname = req.body.fullname
    }
    if (req.body.phone) {
      user.phone = req.body.phone
    }
    user.save((err, savedUser) => {
      if (err) {
        console.error(err)
        return res.status(400).send({
          success: false,
          error: err
        })
      }
      res.status(201).send({
        success: true,
        data: savedUser
      })
    })
  })
})

router.post('/resetpassword', (req, res) => {
  console.log(req.body)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD
    }
  })
  let params = {}
  if (req.body.username) {
    params = {
      username: req.body.username
    }
  } else if (req.body.email) {
    params = {
      email: req.body.email
    }
  }
  if (params === {}) {
    return res.status(400).send({
      success: false,
      error: 'Missing parameters'
    })
  }
  User.findOne(params, (err, user) => {
    if (err) {
      console.error(err)
      return res.status(400).send({
        success: false,
        error: err
      })
    }
    console.log(user)
    const resetToken = jwt.sign(
      {
        username: user.username,
        email: user.email
      },
      process.env.PRIVATE_KEY,
      {
        expiresIn: 600
      }
    )
    const resetLink = 'http://localhost:8000/api/auth/reset/' + resetToken
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: user.email,
      subject: 'Ashutosh Foods password reset.',
      html: `
      <style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
*{
    font-family: 'Montserrat', sans-serif;
    color: #222;
}
body{
    margin: 0;
}
.mainWrapper{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 2rem 0 0 0;
    position: relative;
    background-image: url('https://ashutoshfoods.herokuapp.com/init/pexels-polina-tankilevitch-3872428.jpg') !important;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

}
.messageModal{
    width: 80%;
    /* background-color: #eee; */
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.4);
    padding: 2rem 2rem;
}
.messageHeader{
    font-size: 1.6rem;
    text-align: center;

}
.highlight{
    text-decoration: underline;
    color: #4286f4;
}
.messageContent{
    padding: 1rem 1rem;
    line-height: 1.5rem;
}
.messageFooterWrapper{
    width: 100%;
}
.messageFooter{
    padding: 2rem 2rem 2rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    color: #444;
    background-color: rgba(255, 255, 255, 0.8);
    margin-top: 2rem;
}
</style>
<div class="mainWrapper">
    <div class="messageModal">
        <h1 class="messageHeader">Ashutosh Foods</h1>
        <p class="messageContent">
            Greetings, <br><br>
            We recieved a password reset request for <a href="mailto:${user.email}" class="highlight">${user.email}</a><br>
            Please click <a href="${resetLink}" class="highlight">here</a> to reset your password.<br>
            If the above link does not work for you, please copy and paste the following into your browser address bar:<br>
            <a href="${resetLink}" class="highlight">${resetLink}</a><br><br>
            Thank you,<br>
            Ashutosh Foods Technical Support.
        </p>
    </div>
    <div class="messageFooterWrapper">
        <div class="messageFooter">
            <p>    
                You are receiving this email because <a href="mailto:${user.email}" class="highlight">${user.email}</a> is registered on Ashutosh Foods.<br>
                Please do not reply directly to this email. If you have any questions or feedback, please visit our <a class="highlight" href="https://ashutoshfoods.heroku-app.com/">support website</a>.
            </p>
        </div>
    </div>
</div>
      `
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
    res.send({
      resetToken
    })
  })
})

router.get('/resetpassword/:token', async (req, res) => {
  try {
    var token = await jwt.decode(req.params.token)
    // const newToken = await jwt.sign({
    //   username: token.username,
    //   email: token.email
    // }, process.env.PRIVATE_KEY, { expiresIn: 600 })
  } catch (err) {
    return res.status(404).send()
  }
  res.send({
    token
  })
})

router.post('/reset/', (req, res) => {
  let token
  if (!req.body.password) {
    return res.status(400).send({
      success: false,
      error: 'Missing password'
    })
  }
  try {
    token = jwt.decode(req.body.token)
  } catch (err) {
    return res.status(401)
  }
  User.findOne(
    {
      email: token.email
    },
    (err, user) => {
      if (err) {
        console.error(err)
        return res.status(400).send({
          success: false,
          error: err
        })
      }
      if (user.resetToken && user.resetToken === req.body.token.toString()) {
        return res.status(403).send({
          success: false,
          error: 'This token has already been user'
        })
      }
      user.password = Bcrypt.hashSync(req.body.password, 8)
      user.resetToken = req.body.token.toString()
      user.save((error, savedUser) => {
        if (error) {
          console.error(error)
          return res.status(400).send({
            success: false,
            error
          })
        }
        res.send({
          success: true,
          data: savedUser
        })
      })
    }
  )
})

module.exports = router
