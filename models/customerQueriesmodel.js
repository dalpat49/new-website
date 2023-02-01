
const mongoose = require("mongoose");

const newQuery = new mongoose.Schema({
    customer_name:String,
    customer_email:String,
    customer_subject:String,
    customer_message:String,



})

const customerQuery = mongoose.model("customerQuery", newQuery);


module.exports =  customerQuery;