const mongoosePaginate = require('mongoose-paginate-v2')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const notFound = require('../plugins/notFound')
const ObjectId = Schema.ObjectId
const User = require('./userModel')
const Product = require('./productModel')

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      required: true,
      ref: 'User'
    },
    description: {
      type: String,
      required: false,
      default: ''
    },
    stars: {
      type: Number,
      required: true,
      trim: true,
      max: 5,
      min: 0
    }
  },
  {
    timestamps: true,
    collection: 'reviews'
  }
)
ReviewSchema.plugin(notFound)
ReviewSchema.plugin(mongoosePaginate)

ReviewSchema.post('save', async function (doc) {
  var product = await Product.findById(doc.product).exec()
  var user = await User.findById(doc.user).exec()
  console.log(product, user)
  product.reviews.push(doc._id)
  user.reviews.push(doc._id)
  await product.save()
  await user.save()
})

ReviewSchema.pre('remove', function (next) {
  User.findById(this.user).then(async (user) => {
    var userarrayIndex = await user.reviews.indexOf(this._id)
    if (!user.isAdmin || userarrayIndex === -1) {
      next(new Error('Unauthorized'))
    }
    await user.reviews.splice(userarrayIndex, 1)
    await user.save()
  }).catch(next)
  Product.findById(this.product).then(async (product) => {
    var productarrayIndex = await product.reviews.indexOf(this._id)
    await product.reviews.splice(productarrayIndex, 1)
    await product.save()
  }).catch(next)
  next()
})

module.exports = mongoose.model('Review', ReviewSchema)
