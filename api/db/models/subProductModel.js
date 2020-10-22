const mongoose = require('mongoose')
const notFound = require('../plugins/notFound')
const SubProductSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      trim: true
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true
    }

  },
  {
    timestamps: true,
    collection: 'SubProducts'
  }
)
SubProductSchema.plugin(notFound)
module.exports = mongoose.model('SubProduct', SubProductSchema)
