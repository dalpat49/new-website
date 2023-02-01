
const mongoose = require("mongoose");

const newCart = new mongoose.Schema({
        user_id:String,
        products:
        [{
                product_id:String,
                product_quantity:Number,
                product_name:String,
                product_price:Number,
                product_size:String,
                products_total:Number


               
        }]
        

})

const cart = mongoose.model("cart", newCart);


module.exports =  cart;