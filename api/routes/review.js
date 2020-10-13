const passport = require('passport')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const User = require('./models/userModel')
const Product = require('./models/productModel')
const Review = require('./models/reviewModel')

router.get('/', passport.authenticate('jwt', { session: false }), auth.authenticateAdmin, (req, res, next) => {
  const opts = {
    page: req.query.page ? req.query.page : 1,
    limit: 10,
    collation: {
      locale: 'en'
    }
  }
  Review.paginate({}, opts, (err, result) => {
    if (err) {
      next(err)
    }
    res.send({
      success: true,
      data: result
    })
  })
})

router.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const review = new Review({
    user: req.user._id,
    stars: req.body.stars,
    description: req.body.description ? req.body.description : ''
  })
  review.save().then((savedReview) => {
    User.findOne({ email: req.user.email }).then((user) => {
      user.reviews.push(savedReview._id)
      user.save().then((savedUser) => {
        res.send({
          success: true,
          data: savedReview
        })
      }).catch(next)
    }).catch(next)
  }).catch(next)
})

router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Review.findById(req.params.id).then((review) => {
    if (req.body.stars) {
      review.stars = req.body.stars
    }
    if (req.body.description) {
      review.description = req.body.description
    }
    review.save().then((savedReview) => {
      res.send({
        success: true,
        data: savedReview
      })
    }).catch(next)
  }).catch(next)
})

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Review.deleteOne({ _id: req.params.id, user: req.user._id }).then((deletedReview) => {
    res.send({
      success: true,
      data: deletedReview
    })
  }).catch(next)
})
module.exports = router
