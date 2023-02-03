const mongoose = require('mongoose')

const signupSchema = mongoose.Schema({
    username: String,
    phone: Number,
    address: String,
    zipCode: Number,
    city: String,
    state: String,
    country: String,
    password: String,
    email: String,
    userId: String
})

module.exports = mongoose.model('userInfo', signupSchema)