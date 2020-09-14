const mongoose = require("mongoose");

// _id primary key
const pharmacySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip: {
      type: Number,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    // distance: { // could have used to add to the same object when returning - see pharmacyRouter for partner code
    //   type: Number,
    //   required: false,
    //   default: undefined
    // }
  }
);

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);

module.exports = Pharmacy;