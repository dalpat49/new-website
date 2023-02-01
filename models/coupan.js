const mongoose = require("mongoose");



const newCoupan = new mongoose.Schema({
    coupan_code:String,
    coupan_description:String,
    coupan_type:String,
    coupan_ammount:{type:Number,default:0},
    coupan_category:String,
    creation_date:Date,
    status:String,
    expireAt:{ type: Date,
        default: Date.now,
        index: { expires: '1m' } }

   });

const coupan = mongoose.model("coupan", newCoupan);

module.exports =  coupan;
  
  