const mongoose = require('mongoose')
const notFound = require('../plugins/notFound')
const SubProduct = require('./subProductModel')
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
    subProducts: [{
      type: mongoose.Schema.ObjectId,
      ref: 'SubProduct',
      required: true
    }],
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
    collection: 'products',
    autoIndex: true
  }
)

ProductSchema.plugin(notFound)

ProductSchema.pre('remove', function (next) {
  this.subProducts.forEach((subproduct) => {
    SubProduct.findById(subproduct).then((foundSubProduct) => {
      foundSubProduct.remove()
    }).catch(next)
  })
  next()
})
module.exports = mongoose.model('Product', ProductSchema)
