const mongoose = require("mongoose");



const newReview = new mongoose.Schema({
    review:String,
    name:String,
    email:String,
    customerId:String,
    productname:String,
    productId:String,
    image:String,
    date: Date
   });

const review = mongoose.model("review", newReview);

module.exports =  review;
  
  