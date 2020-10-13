const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
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
    image: {
      type: String,
      required: false
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true
    },
    isSpecial: {
      type: Boolean,
      required: true,
      default: false
    },
    source: {
      type: String,
      required: false
    },
    priority: {
      type: Number,
      required: true,
      default: 0
    },
    reviews: [
      {
        type: mongoose.Schema.ObjectId,
        required: false,
        ref: 'Review'
      }
    ]
  },
  {
    timestamps: true,
    collection: 'products'
  }
)

module.exports = mongoose.model('Product', ProductSchema)
