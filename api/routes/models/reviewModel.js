const mongoosePaginate = require('mongoose-paginate-v2')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      required: true,
      ref: 'User'
    },
    product: {
      type: ObjectId,
      required: true,
      ref: 'Product'
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

ReviewSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Review', ReviewSchema)
