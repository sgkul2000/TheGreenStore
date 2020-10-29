const passport = require('passport')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const Address = require('../db/models/addressModel')
const User = require('../db/models/userModel')
const Order = require('../db/models/orderModel')
// const Product = require('./models/productModel')

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    // expected params are : all, completed, id
    let params = {
      user: req.user._id
    }
    if (req.query.admin === 1) {
      if (parseInt(req.query.all) === 1) {
        params = {}
      } else if (parseInt(req.query.completed) === 1) {
        params = {
          status: 'complete'
        }
      } else if (parseInt(req.query.completed) === 0) {
        params = {
          status: 'pending'
        }
      } else if (req.query.id) {
        params = {
          _id: req.query.id
        }
      }
    } else {
      params = {
        user: req.user._id
      }
    }
    const options = {
      page: req.query.page ? req.query.page : 1,
      limit: 10,
      sort: {
        createdAt: -1
      },
      populate: [
        'user',
        {
          path: 'cart',
          populate: {
            path: 'product',
            model: 'Product'
          }
        },
        {
          path: 'cart',
          populate: {
            path: 'subProducts',
            populate: {
              path: 'subProduct',
              model: 'SubProduct'
            }
          }
        }
      ]
    }
    Order.paginate(params, options)
      .then((orders) => {
        res.send({
          success: true,
          data: orders
        })
      })
      .catch(next)
  }
)

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    // expected params are : all, completed, id
    let params = {
      user: req.user._id,
      _id: req.params.id
    }
    if (req.query.admin === 1) {
      if (parseInt(req.query.all) === 1) {
        params = {
          _id: req.params.id
        }
      } else if (parseInt(req.query.completed) === 1) {
        params.status = 'complete'
      } else if (parseInt(req.query.completed) === 0) {
        params.status = 'pending'
      }
    }
    console.log('user : ', req.user)
    console.log('params', params)
    Order.find(params, null, {
      sort: {
        createdAt: -1
      }
    })
      .populate('user')
      .populate({
        path: 'cart',
        populate: {
          path: 'product',
          model: 'Product'
        }
      })
      .populate({
        path: 'cart',
        populate: {
          path: 'subProducts',
          populate: {
            path: 'subProduct',
            model: 'SubProduct'
          }
        }
      })
      .exec()
      .then((orders) => {
        console.log(orders)
        res.send({
          success: true,
          data: orders
        })
      })
      .catch(next)
  }
)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    // console.log(req.body)
    // var cartProducts = await Product.find({}).exec()
    // var productList = await cartProducts.filter((product) => {
    //   return req.body.cart.includes(product._id.toString())
    // })
    // var amount = 0
    // for (let index = 0; index < productList.length; index++) {
    //   // await console.log('product price', productList[index].price)
    //   amount += await productList[index].price
    // }
    var orderAddress = await Address.findById(req.body.address).exec()
    const newOrder = new Order({
      user: req.user._id,
      amount: 0,
      cart: req.body.cart,
      address: orderAddress
    })
    newOrder
      .save()
      .then((savedOrder) => {
        console.log('saved order = ', savedOrder)
        User.findById(savedOrder.user)
          .then((orderedUser) => {
            // console.log('user info:', orderedUser)
            orderedUser.orders.push(savedOrder._id)
            orderedUser
              .save()
              .then(async (updatedUser) => {
                // console.log(updatedUser)
                await savedOrder.populate({
                  path: 'cart',
                  populate: {
                    path: 'product',
                    model: 'Product'
                  }
                })
                await savedOrder
                  .populate('user')
                  .populate({
                    path: 'cart',
                    populate: {
                      path: 'subProducts',
                      populate: {
                        path: 'subProduct',
                        model: 'SubProduct'
                      }
                    }
                  })
                  .execPopulate()
                res.send({
                  success: true,
                  data: savedOrder
                })
              })
              .catch(next)
          })
          .catch(next)
      })
      .catch(next)
  }
)

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    Order.findById(req.params.id)
      .then((order) => {
        // console.log(order)
        // console.log(req.user._id ,order.user)
        if (req.user._id.toString() !== order.user.toString()) {
          if (
            !(
              parseInt(req.query.forcedelete) === 1 && req.user.isAdmin === true
            )
          ) {
            return res.status(401).send({
              success: false,
              message: 'Unauthorized user'
            })
          }
        }
        User.findById(req.user._id)
          .then(async (user) => {
            var arrayIndex = await user.orders.indexOf(req.params.id)
            await user.orders.splice(arrayIndex, 1)
            await user
              .save()
              .then((savedUser) => {
                console.log(savedUser)
              })
              .catch(next)
          })
          .catch(next)
        order
          .remove()
          .then(async (removedOrder) => {
            await removedOrder.populate('user').execPopulate()
            res.send({
              success: true,
              data: removedOrder
            })
          })
          .catch(next)
      })
      .catch(next)
  }
)

router.put(
  '/status/:id',
  passport.authenticate('jwt', { session: false }),
  auth.authenticateAdmin,
  (req, res, next) => {
    console.log(req.params.id, req.body)
    Order.findById(req.params.id)
      .then((order) => {
        order.status = req.body.status
        order
          .save()
          .then((savedOrder) => {
            res.send({
              success: true,
              data: savedOrder
            })
          })
          .catch(next)
      })
      .catch(next)
  }
)

// route to change address
router.put(
  '/:id/address',
  passport.authenticate('jwt', { session: false }),
  auth.authenticateAdmin,
  (req, res, next) => {
    // console.log(req.params.address)
    Order.findById(req.params.id)
      .then((order) => {
        order.address = req.body.address
        order
          .save()
          .then((savedOrder) => {
            res.send({
              success: true,
              data: savedOrder
            })
          })
          .catch(next)
      })
      .catch(next)
  }
)

router.get('/sales/total', (req, res, next) => {
  Order.aggregate([
    {
      $match: {
        status: 'complete'
      }
    },
    {
      $group: {
        _id: {
          $month: '$createdAt'
        },
        sales: {
          $sum: '$amount'
        }
      }
    }
  ])
    .then((orders) => {
      res.json({
        success: true,
        data: orders
      })
    })
    .catch(next)
})

module.exports = router
