const mongoose = require('mongoose')


const productSchema = mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    img: String,
    inventory: Number,
    productId: String
})


module.exports = mongoose.model('product', productSchema)