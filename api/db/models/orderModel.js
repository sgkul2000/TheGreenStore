const mongoose = require('mongoose')
const notFound = require('../plugins/notFound')
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
        product: {
          type: mongoose.Schema.ObjectId,
          required: true,
          ref: 'Product'
        },
        subProducts: [{
          subProduct: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'Price'
          },
          price: {
            type: Number,
            required: true,
            trim: true,
            default: 0
          },
          quantity: {
            type: Number,
            required: true,
            trim: true
          }
        }]
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

OrderSchema.plugin(notFound)

OrderSchema.pre('save', async function (next) {
  try {
    // var cartProducts = await Product.find({}).exec()
    // console.log(cartProducts)
    // var productList = await cartProducts.filter((product) => {
    //   return this.cart.includes(product._id.toString())
    // })
    // var amount = 0
    // for (let index = 0; index < productList.length; index++) {
    //   // await console.log('product price', productList[index].price)
    //   amount += await productList[index].price
    // }

    // reference data
    // cart = {
    //   {
    //     product,
    //     subProducts:[
    //       {
    //         _id
    //         price,
    //         quantity,
    //         subProduct
    //       }
    //     ]
    //   }
    // }
    var amount = 0
    for (var i = 0; i < this.cart.length; i++) {
      var data = await Product.findById(this.cart[i].product).populate('subProducts').exec()
      for (var j = 0; j < this.cart[i].subProducts.length; j++) {
        for (var k = 0; k < data.subProducts.length; k++) {
          if (data.subProducts[k]._id.toString() === this.cart[i].subProducts[j].subProduct.toString()) {
            this.cart[i].subProducts[j].price = data.subProducts[k].price
            amount += this.cart[i].subProducts[j].price * this.cart[i].subProducts[j].quantity
            console.log('adding to amount', this.cart[i].subProducts[j].price, 'total = ', amount)
          }
        }
      }
    }
    console.log(amount)
    this.amount = amount
    next()
  } catch (err) {
    console.error(err)
  }
})

module.exports = mongoose.model('Order', OrderSchema)
