const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const referralCodeGenerator = require('referral-code-generator')
const notFound = require('../plugins/notFound')

const UserSchema = new mongoose.Schema({
  username: {
    unique: true,
    trim: true,
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    unique: true,
    trim: true,
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 10
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false
  },
  orders: [{
    type: mongoose.Schema.ObjectId,
    required: false,
    ref: 'Order'
  }],
  reviews: [{
    type: mongoose.Schema.ObjectId,
    required: false,
    ref: 'Review'
  }],
  addresses: [{
    type: mongoose.Schema.ObjectId,
    required: false,
    ref: 'Address'
  }],
  resetToken: {
    type: String,
    required: false
  },
  referralCode: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'users'
})

UserSchema.plugin(notFound)

UserSchema.pre(
  'save',
  async function (next) {
    const user = this
    if (user.isModified('password')) {
      const hash = await bcrypt.hash(this.password, 8)
      this.password = hash
    }
    if (user.isModified('referralCode')) {
      const referralCode = referralCodeGenerator.custom(
        'uppercase',
        3,
        3,
        user.username
      )
      console.log(referralCode)
      this.referralCode = referralCode
    }
    next()
  }
)
UserSchema.methods.isValidPassword = async function (password) {
  const user = this
  const compare = await bcrypt.compare(password, user.password)

  return compare
}

UserSchema.path('email').validate(function (email) {
  var emailRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/
  return emailRegex.test(email) // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')

module.exports = mongoose.model('User', UserSchema)
