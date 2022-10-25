// lib
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const {
  v4: uuidv4
} = require('uuid');
const fs = require('fs')
require('dotenv/config')

//custom files
const product = require('./product_Schema')
const productValidator = require('./validator/product-validator');

const app = express();


// middleware
app.use(express.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(express.static("public"))


mongoose.connect(process.env.DB_connection, () => {
  console.log('connected to db')
})


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "./public"))
})

// ToDo Need to implement 
app.get('/products', async function (req, res) {
  try {
    const posts = await product.find()
    res.json(posts)
  } catch (err) {
    res.json({
      message: err
    })
  }
})

app.post('/product', async function (req, res) {

  const validateObj = productValidator(req.body.title, req.body.description, req.body.price, req.body.inventory)
  if (!validateObj.isValid) {
    return res.json({
      success: false,
      error: validateObj.error
    })
  }
  const productId = uuidv4();
  const respObj = new product({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    inventory: req.body.inventory,
    img: req.body.image,
    productId: productId
  })

  await respObj.save(function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result)
    }
  });

  res.status(201).json({
    success: true,
    data: {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      inventory: req.body.inventory,
      img: req.body.image,
      productId: productId
    }
  });

})

app.listen(5000)








//   if fail
//     - return {isValid:false, error: "title should not be empty"}  
//   if success
//     - return {isValid: true};
// }
// const validateObj = validateProduct(req.body.title,...);
// if(!validateObj.isValid){
//   return res.json({success: validateObj.isValid, error: validateObj.error})
//   // return;
// }