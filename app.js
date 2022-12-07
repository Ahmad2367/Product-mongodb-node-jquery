// lib
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const fs = require('fs')
require('dotenv/config')


//custom files
const products = require('./controller/product-routes')
const login = require('./controller/login-route')
const middleware = require('./auth/auth-middleware')

// initializing the express framework
const app = express();


// middleware
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(express.static("public"))
app.use(middleware)

// Running the static file 
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "./public"))
})

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) {
    thr
  } else {
    console.log('Connected to DB')
  }
})

app.use('/', login)
app.use('/products', products)

// app.listen(process.env.PORT || 5000)
module.exports = app;