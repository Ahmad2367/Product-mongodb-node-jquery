// lib
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const {sign,verify} = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid');
const fs = require('fs')
require('dotenv/config')

//custom files
const product = require('./product_Schema')
const productValidator = require('./validator/product-validator');
const user = require('./sign up_schema')
const userValidation = require('./signup_validator/signup_fields_validator')

// intializing the express
const app = express();


// middleware
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(express.static("public"))

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
    let checkVerify = verify(Token, process.env.Access_Token_Secret)

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

// Running the static file 
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "./public"))
})

// Get all the products
app.get('/products', async function (req, res) {
  try {
    const products = await product.find()
    res.json({
      success: true,
      data: products,
      error: ""
    })
  } catch (err) {
    res.json({
      success: false,
      data: "",
      error: 'Something went wrong'
    })
  }
})

// Save all product data in database
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
// Delete a product
app.delete('/product/:productId', async function (req, res) {
  try {
    const removeProduct = await product.remove({
      productId: req.params.productId
    })
    res.json({
      success: true,
      data: removeProduct,
      error: ''
    })
  } catch (err) {
    res.json({
      success: false,
      data: null,
      error: 'Something went wrong'
    })
  }
})

// Update the product tile in the database
app.put('/product/:productId', async (req, res) => {

  try {
    const updateProduct =
      await product.updateOne({
        productId: req.params.productId
      }, {
        $set: {
          title: req.body.title,
          description: req.body.description,
          price: req.body.price,
          img: req.body.image
        }
      })
    res.json({
      success: true,
      data: updateProduct,
      err: ""
    })
  } catch (err) {
    res.json({
      success: false,
      data: null,
      error: 'Something went wrong'
    })
  }
})

// get Product by search and price Range
app.get('/products/search', async function (req, res) {
  try {
    const search_Key = req.query.searchTerm;
    const maxPrice = parseInt(req.query.maxRange)
    const minPrice = parseInt(req.query.minRange)

    // By default we have empty query 
    let searchQuery = [];

    // Generate title query if required
    if (search_Key) {
      searchQuery.push({
        title: {
          $regex: `${search_Key}`,
          $options: "i",
        }
      });
    }

    // Generate price query if required
    let priceRangObj = {};
    if (!isNaN(maxPrice)) { // if there is a valid numeric value in max price
      priceRangObj.$lte = maxPrice;
    }
    if (!isNaN(minPrice)) {
      priceRangObj.$gte = minPrice;
    }

    if (Object.keys(priceRangObj).length > 0) {
      searchQuery.push({
        price: priceRangObj
      })
    }

    // Execute query on DB
    const proSearch = await product.find({
      $and: searchQuery
    })

    const newProduct = proSearch.map((item) => {
      return {
        productId: item.productId,
        title: item.title,
        description: item.description,
        price: item.price,
        img: item.img,
        inventory: item.inventory
      }
    })

    res.
    json({
      success: true,
      data: newProduct,
      err: ""
    })
  } catch (err) {
    res.json({
      success: false,
      msg: err
    })

  }

})

//////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////signup APi////////////////////////////////////////////////////////

app.post('/signup', async function (req, res) {

  let validateUser = userValidation(req.body.username, req.body.password, req.body.email)

  if (!validateUser.isValid) {
    return res.json({
      success: false,
      error: validateUser.errMsg
    })
  }

  const {
    username,
    email
  } = req.body

  const userExist = await user.find({
    username: username
  })
  if (userExist.length > 0) {
    return res.json({
      success: false,
      error: 'Username already exists. Try a different one.'
    })
  }
  const emailExist = await user.find({
    email: email
  })
  if (emailExist.length > 0) {
    return res.json({
      success: false,
      error: 'Email already exists. Try a different one'
    })
  }


  const UserID = uuidv4()
  const User = new user({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    userId: UserID
  })
  // check error without passing callBack function---
  await User.save(function (err, result) {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
    }

    return res.status(201).json({
      success: true,
      data: User
    })

  })

})


//////////////////////////////////////////////Login Api/////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/login', async function (req, res) {

  const email = req.body.loginEmail
  const password = req.body.loginPassword
  const findFields = await user.find({
    email: email,
    password: password
  })

  const accessToken = sign({
    clientID: findFields[0].userId
  }, process.env.Access_Token_Secret)



  if (findFields.length > 0) {

    return res.json({
      success: true,
      Value: accessToken
    })
  }
  if (findFields == undefined || findFields.length === 0) {
    return res.json({
      success: false,
      error: 'Incorrect email or password. Please provide the right information'
    })
  }
})

////////////////////////////////////////////////////logout api///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

app.delete('/logout', async function (req, res) {
  await res.clearCookie('userID')
  try {
    res.json({
      success: true,
      err: ""

    })
  } catch {
    res.json({
      success: false,
      error: 'Something went wrong'
    })
  }

})

app.listen(5000)