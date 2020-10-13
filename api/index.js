const path = require('path')
const express = require('express')
const BodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
// const passport = require('passport')

require('./middleware/auth')

// establishing environment variable
dotenv.config()

// importing routes
const authRouter = require('./routes/auth')
const productRouter = require('./routes/product')
const orderRouter = require('./routes/order')
const addressRouter = require('./routes/address')
const reviewRouter = require('./routes/review')
const viewRouter = require('./routes/view')

const errorHandler = require('./middleware/errorHandler')

// setting up mongoose database
mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// logger for incoming requests
const logger = morgan('dev', {
  // skip: function (req, res) { return res.statusCode < 400 }
})

const app = express()

// middleware
app.use(logger)
app.use(cors())
app.use(BodyParser.json())

// setting static folder to "public"
app.use(express.static(path.join(__dirname, '/public')))

// including routes
app.use('/api/auth', authRouter)
app.use('/api/product', productRouter)
app.use('/api/order', orderRouter)
app.use('/api/address', addressRouter)
app.use('/api/review', reviewRouter)

// view route
app.use('/', viewRouter)

// Error handler middleware
app.use(errorHandler)

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  // setting port
  const port = process.env.PORT || 8000
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
