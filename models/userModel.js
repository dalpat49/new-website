const mongoose = require("mongoose");

const mydata = new mongoose.Schema({
    fullname: String,
    email: String,
    number: Number,
    addressLine1: String,
    addressLine2: String,
    country: String,
    state: String,
    city: String,
    zipcode: Number,
    password: String,
    photo: String,
    status:{type:String, default:"active"}
   });

const data = mongoose.model("data", mydata);

module.exports =  data;
  
  