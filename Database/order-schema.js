const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    
    customerId: String,
    orderId: String,
    orderDetails: String,
    paymentMode: Number
})

module.exports =  mongoose.model('OrderInfo', orderSchema)