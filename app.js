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
const products = require('./controller/product_routes')
const login = require('./controller/login_route')
// intializing the express
const app = express();


// middleware
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(express.static("public"))


// Running the static file 
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "./public"))
})

app.use(async (req, res, next) => {

  if (req.url === '/login') {
    next()

  } else if (!req.headers['authorization']) {

    return res.status(401).json({
      success: false,
      error: 'Access Denied'
    })

  } else {

    const Token = req.headers['authorization'].split(' ')[1].trim()
    let checkVerify = jwt.verify(Token, process.env.Access_Token_Secret)

    if (checkVerify) {
      next()
    } else {
      res.sendStatus('401').json({
        error: 'Invalid Token'
      })
    }
  }
})




mongoose.connect(process.env.DB_connection, () => {
  console.log('connected to db')
})


app.use('/products', products)
app.use('/', login)


//////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////signup APi////////////////////////////////////////////////////////



app.listen(5000)