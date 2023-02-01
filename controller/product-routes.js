const express = require('express')
const router = express.Router()
const productValidator = require('../validation/product-validator');
const product = require('../Database/product-schema')
const user = require('../Database/user-schema')
const {
    v4: uuidv4
} = require('uuid');


router.get('/', async function (req, res) {
    try {
        let proID = req.query.productId 
        if(proID) {
            
            const proObj = await product.findOne({
                productId: proID
            })

            return res.json({
                success: true,
                data: proObj
            })
            
        }
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
router.post('/', async function (req, res) {

    let token =   req.headers['authorization']
    let decryptToken =   JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    let userID = decryptToken.clientID
    const findUser = await user.findOne({
        userId: userID
    })
    if(!findUser._doc.username === "Admin")
    {
      return  res.sendStatus('401')
    }

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
        productId: productId,
    
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
router.delete('/:productId', async function (req, res) {
    try {

    let token =   req.headers['authorization']
    let decryptToken =   JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    let userID = decryptToken.clientID
    const findUser = await user.findOne ({
        userId: userID
    })

    if(!(findUser._doc.username === 'Admin')) {

      return  res.sendStatus('401')
    }

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
router.put('/:productId', async (req, res) => {

    try {
    let token =   req.headers['authorization']
    let decryptToken =   JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    let userID = decryptToken.clientID
    const findUser = await user.findOne ({
        userId: userID
    })

    if(!findUser._doc.username === "Admin")
    {
      return  res.sendStatus('401')  
    }
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
router.get('/search', async function (req, res) {
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



module.exports = router