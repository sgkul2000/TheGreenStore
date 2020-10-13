const mongoose = require('mongoose')
const Product = require('./productModel')
const OrderSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      trim: true,
      default: 0
    },
    cart: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Product'
      }
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User'
    },
    address: {
      type: Object,
      required: true
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: ['pending', 'complete', 'archived']
    }
  },
  {
    timestamps: true,
    collection: 'orders'
  }
)

OrderSchema.pre('save', async function (next) {
  try {
    var cartProducts = await Product.find({}).exec()
    console.log(cartProducts)
    var productList = await cartProducts.filter((product) => {
      return this.cart.includes(product._id.toString())
    })
    var amount = 0
    for (let index = 0; index < productList.length; index++) {
      // await console.log('product price', productList[index].price)
      amount += await productList[index].price
    }
    this.amount = amount
    next()
  } catch (err) {
    console.error(err)
  }
})

module.exports = mongoose.model('Order', OrderSchema)
