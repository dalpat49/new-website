const mongoose = require("mongoose");


//myAddress
const myAddress = new mongoose.Schema({
    email: String,
    housenumber: String,
    colony: String,
    landmark: String,
    city: String,
    district: String,
    state: String,
    zipcode: Number,
  });
  
//Address model
const address = mongoose.model("address", myAddress);

module.exports  =  address;