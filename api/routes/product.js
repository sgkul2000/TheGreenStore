
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const passport = require('passport')
const auth = require('../middleware/auth')

const Product = require('./models/productModel')

const unlinkAsync = promisify(fs.unlink)

const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('invalid file type'), false)
  }
}

const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, path.resolve(__dirname, '../public/images/uploads/'))
  },
  filename (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  }
})
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
})

router.get('/', async (req, res, next) => {
  // console.log(req.body)
  let params = {}
  if (req.query.category) {
    console.log(req.query.category)
    params = {
      category: req.query.category
    }
  }
  if (req.query.id) {
    params._id = req.query.id
  }
  if (req.query.search) {
    params.name = {
      $regex: req.query.search,
      $options: 'i'
    }
  }
  try {
    const products = await Product.find(params).exec()
    res.send({
      success: true,
      data: products
    })
  } catch (err) {
    next(err)
  }
})

router.post(
  '/',
  passport.authenticate('jwt', { session: false }), auth.authenticateAdmin,
  upload.single('productImage'),
  async (req, res, next) => {
    const filePath = req.file ? req.file.path.replace(path.resolve(__dirname, '../') + '/', '') : null
    console.log(req.body)
    const product = await new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      priority: req.body.priority,
      image: filePath,
      source: req.body.source ? req.body.source : null
    })
    product.save().then((product) => {
      console.log(product)
      res.status(201).send({
        success: true,
        data: product
      })
    }).catch(next)
  }
)

router.delete('/:id', passport.authenticate('jwt', { session: false }), auth.authenticateAdmin, (req, res, next) => {
  console.log(req.params.id)
  Product.findById(req.params.id).exec().then(async (product) => {
    console.log(product.image)
    // console.log(path.resolve(__dirname, '../', ('/' + product.image).replace(path.resolve(__dirname, '../') + '/', '')))
    try {
      await unlinkAsync(path.resolve('/', __dirname, '../', (product.image)))
    } catch (err) {
      console.error(err)
    }
    product.remove().then((product) => {
      res.send({
        success: true,
        product
      })
    }).catch(next)
  }).catch(next)
})

router.put('/:id', passport.authenticate('jwt', { session: false }), auth.authenticateAdmin, (req, res, next) => {
  console.log(req.params.id)
  console.log(req.body)
  Product.findById(req.params.id).then((product) => {
    console.log('product', product)
    if (req.body.name) {
      product.name = req.body.name
    }
    if (req.body.description) {
      product.description = req.body.description
    }
    if (req.body.price) {
      product.price = req.body.price
    }
    if (req.body.quantity) {
      product.quantity = req.body.quantity
    }
    if (req.body.isAvailable) {
      product.isAvailable = req.body.isAvailable
    }
    if (req.body.isSpecial) {
      product.isSpecial = req.body.isSpecial
    }
    if (req.body.category) {
      product.category = req.body.category
    }
    product.save().then((newProduct) => {
      res.send({
        success: true,
        data: newProduct
      })
    }).catch(next)
  }).catch(next)
})

router.put('/image/:id', upload.single('productImage'), (req, res, next) => {
  const filePath = req.file.path.split('/').slice(1).join('/')
  console.log(filePath)
  if (!req.params.id) {
    return next(new Error('Parameter missing!'))
  }
  Product.findById(req.params.id).then(async (product) => {
    try {
      await unlinkAsync(path.resolve('/', __dirname, '../', (product.image)))
    } catch (err) {
      console.error(err)
    }
    product.image = filePath
    product.save().then((savedProduct) => {
      res.status(201).send({
        success: true,
        data: savedProduct
      })
    }).catch(next)
  }).catch(next)
})

module.exports = router
