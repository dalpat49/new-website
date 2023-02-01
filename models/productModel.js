const mongoose = require("mongoose");
const { Int32 } = require("mongodb");

const newProduct = new mongoose.Schema({
    productName: String,
    brand: String,
    price:Number,
    category: String,
    size:Array,
    discription: String,
    additionalInformation:String,
    image:Array,
    status:String
   });

const product = mongoose.model("product", newProduct);

module.exports =  product;
  
  