const mongoose = require("mongoose");

const Newdelivery = new mongoose.Schema({
    order_id:String,

    customer_name:String,
    customer_email:String,
    customer_number:Number,
    customer_addressLine1:String,
    customer_addressLine2:String,
    customer_country:String,
    customer_state:String,
    customer_city:String, 
    customer_zipcode:Number,
    subtotal_of_products:String,
    shipping_charge:String,
    total_ammount:String,
    method_of_payment:String,
    product_details:[{
            product_Name:Array,
            Product_size:Array,
            product_price:Array,
            product_quantity:Array
    }],
    date:Date

})

const delivery = mongoose.model("delivery", Newdelivery);


module.exports =  delivery;