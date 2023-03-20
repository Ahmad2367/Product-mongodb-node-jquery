const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    
    orderId: String,
    name: String,
    email: String,
    address: String,
    city: String,
    state: String,
    proDetails: String,
    orderStatus: String,
    orderDate: String
})

module.exports =  mongoose.model('orderz', orderSchema)