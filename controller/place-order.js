const express = require('express');
const router = express.Router();
const validateOrder = require('../validation/order-info-validator')


router.post('/', async function(req,res) {
   
   const validateObj = validateOrder(req.body.customerName, req.body.customerEmail, req.body.customerAddress, req.body.customerCity, req.body.customerState)
    if (!validateObj.isValid) {
        return res.json({
            success: false,
            error: validateObj.error
        })
    }  

    const orderInfo = new order ({
        name : req.body.customerName,
        email: req.body.customerEmail,
        address: req.body.customerAddress,
        city: req.body.customerCity,
        state: req.body.customerState
    }) 

    await orderInfo.save(function (err, result) {
        if(err) {
            console.log(err)
        } else {
            console.log(result)
        }
    })

    res.status('201').json({
        success: true,
        data: "Added successfully"
    })
})





module.exports = router