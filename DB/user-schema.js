const mongoose = require('mongoose')

const signupSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    userId: String
})

module.exports = mongoose.model('userInfo', signupSchema)