const mongoose = require("mongoose");

const newSubscriber = new mongoose.Schema({
    name:String,
    email:String
   });

const subscribe = mongoose.model("subscribe", newSubscriber);

module.exports =  subscribe;
  
  