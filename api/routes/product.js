
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const passport = require('passport')
const auth = require('../middleware/auth')

const Product = require('../db/models/productModel')
const SubProduct = require('../db/models/subProductModel')

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
    params = {
      category: req.query.category
    }
  }
  if (req.query.search) {
    params.name = {
      $regex: req.query.search,
      $options: 'i'
    }
  }
  try {
    const products = await Product.find(params).populate('subProducts').exec()
    res.send({
      success: true,
      data: products
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', (req, res, next) => {
  console.log(req.params.id)
  Product.findById(req.params.id).populate('subProducts').exec((err, product) => {
    if (err) {
      next(new Error('Product not found'))
    }
    res.send({
      success: true,
      data: product
    })
  })
})

router.post(
  '/',
  passport.authenticate('jwt', { session: false }), auth.authenticateAdmin,
  async (req, res, next) => {
    console.log(req.body)
    var subProductList = []
    for (var i = 0; i < req.body.subProducts.length; i++) {
      try {
        const newSubProduct = await new SubProduct({
          price: req.body.subProducts[i].price,
          quantity: req.body.subProducts[i].quantity
        })
        var savedSubProduct = await newSubProduct.save()
        console.log(savedSubProduct)
        subProductList.push(savedSubProduct._id)
      } catch (err) {
        console.error(err)
        next(err)
      }
    }
    const product = await new Product({
      name: req.body.name,
      description: req.body.description,
      subProducts: subProductList,
      priority: req.body.priority ? req.body.priority : 0
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

router.post('/:product/subproduct', passport.authenticate('jwt', { session: false }), auth.authenticateAdmin, (req, res, next) => {
  Product.findById(req.params.product).then(async (product) => {
    if (!product) {
      throw new Error('product not found')
    }
    var newSubProduct = await new SubProduct({
      price: req.body.price,
      quantity: req.body.quantity
    })
    newSubProduct.save().then((savedSubProduct) => {
      product.subProducts.push(savedSubProduct._id)
      product.save().then((savedProduct) => {
        res.send({
          success: true,
          data: savedSubProduct
        })
      }).catch(next)
    }).catch(next)
  }).catch(next)
})

router.delete('/:id', passport.authenticate('jwt', { session: false }), auth.authenticateAdmin, (req, res, next) => {
  console.log(req.params.id)
  Product.findById(req.params.id).exec().then(async (product) => {
    console.log(product.image)
    // console.log(path.resolve(__dirname, '../', ('/' + product.image).replace(path.resolve(__dirname, '../') + '/', '')))
    try {
      await unlinkAsync(path.resolve('/', __dirname, '../', (product.image)))
    } catch (err) {
      if (err.message !== 'The "path" argument must be of type string. Received undefined') {
        console.error(err)
      }
    }
    for (let i = 0; i < product.subProducts.length; i++) {
      try {
        await SubProduct.deleteMany({ product: req.params.id })
      } catch (err) {
        console.error(err)
        next(err)
      }
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
  console.log(req.body.isSpecial)
  Product.findById(req.params.id).then((product) => {
    console.log('product', product)
    if (typeof req.body.name !== 'undefined') {
      product.name = req.body.name
    }
    if (typeof req.body.description !== 'undefined') {
      product.description = req.body.description
    }
    if (typeof req.body.isSpecial !== 'undefined') {
      product.isSpecial = req.body.isSpecial
    }
    if (typeof req.body.isAvailable !== 'undefined') {
      product.isAvailable = req.body.isAvailable
    }
    product.save().then((newProduct) => {
      res.send({
        success: true,
        data: newProduct
      })
    }).catch(next)
  }).catch(next)
})

router.put('/image/:id', passport.authenticate('jwt', { session: false }), auth.authenticateAdmin, upload.single('productImage'), (req, res, next) => {
  console.log(req.file.path.replace(path.resolve(__dirname, '../public/') + '/', ''))
  const filePath = req.file ? req.file.path.replace(path.resolve(__dirname, '../public/') + '/', '') : null
  // console.log(filePath)
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

router.put('/:product/subproduct/:subproduct', passport.authenticate('jwt', { session: false }), auth.authenticateAdmin, (req, res, next) => {
  Product.findById(req.params.product).then(async (product) => {
    var arrayIndex = await product.subProducts.indexOf(req.params.subproduct)
    SubProduct.findById(product.subProducts[arrayIndex]).then((subProduct) => {
      if (typeof req.body.price !== 'undefined') {
        subProduct.price = req.body.price
      }
      if (typeof req.body.quantity !== 'undefined') {
        subProduct.quantity = req.body.quantity
      }
      subProduct.save().then((savedSubProduct) => {
        res.send({
          success: true,
          data: savedSubProduct
        })
      }).catch(next)
    })
  }).catch(next)
})

router.delete('/:product/subproduct/:subproduct', passport.authenticate('jwt', { session: false }), auth.authenticateAdmin, (req, res, next) => {
  Product.findById(req.params.product).then(async (product) => {
    var arrayIndex = await product.subProducts.indexOf(req.params.subproduct)
    await product.subProducts.splice(arrayIndex, 1)
    product.save().then((savedUser) => {
      SubProduct.findById(req.params.subproduct).then((subproduct) => {
        subproduct.remove().then((removedSubProduct) => {
          res.send({
            success: true,
            data: removedSubProduct
          })
        }).catch(next)
      }).catch(next)
    }).catch(next)
  }).catch(next)
})

module.exports = router
