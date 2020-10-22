const mongoose = require('mongoose')
const notFound = require('../plugins/notFound')
const AddressSchema = new mongoose.Schema(
  {
    buildingDetails: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    landmark: {
      type: String,
      required: false
    },
    cityName: {
      type: String,
      required: true
    },
    stateName: {
      type: String,
      required: true
    },
    pincode: {
      type: Number,
      required: true,
      trim: true
    },
    gpsLocation: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
    collection: 'addresss'
  }
)
AddressSchema.plugin(notFound)
module.exports = mongoose.model('Address', AddressSchema)
