
const mongoose = require("mongoose");

const category = new mongoose.Schema({
    categoryName: String,
    category_id : Number,
    status:String,
    description: String,
    subcategory:[{
        parent_id:Number,


        subcategory_name:String
}]

})

const allCategories = mongoose.model("allCategories", category);


module.exports =  allCategories;