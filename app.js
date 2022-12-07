// lib
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const fs = require('fs')
require('dotenv/config')


//custom files
const products = require('./controller/product-routes')
const login = require('./controller/login-route')

// intializing the express
const app = express();


// middleware
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(express.static("public"))
require('./auth/auth-middleware')


// Running the static file 
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "./public"))
})






mongoose.connect("mongodb://127.0.0.1:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) {
    thr
  } else {
    console.log('Connected to DB')
  }
})


app.use('/products', products)
app.use('/', login)


//////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////signup APi////////////////////////////////////////////////////////



app.listen(5000)