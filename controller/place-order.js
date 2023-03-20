const express = require('express');
const nodemailer = require("nodemailer");
const router = express.Router();
const validateOrder = require('../validation/order-info-validator')
const order = require('../Database/order-schema')
const {v4: uuidv4} = require('uuid');


const transport =  nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "mahmadshafiqbutt@gmail.com",
            pass:  "hgoxydvahbsxccyx" 
        }
    });
    


router.post('/', async function(req,res) {
   
   const validateObj = validateOrder(req.body.customerName, req.body.customerEmail, req.body.customerAddress, req.body.customerCity, req.body.customerState)
    if (!validateObj.isValid) {
        return res.json({
            success: false,
            error: validateObj.error
        })
    }  
     
    let cart = req.session.cart
    let proDetails = JSON.stringify(cart)
    const orderId = uuidv4();
    const orderDate = new Date() 
    const dateString = orderDate.toUTCString()

    let orderInfo =  new order ({
        orderId: orderId,
        name : req.body.customerName,
        email: req.body.customerEmail,
        address: req.body.customerAddress,
        city: req.body.customerCity,
        state: req.body.customerState,
        proDetails: proDetails,
        orderStatus: "orderReceived",
        orderDate: dateString
    }) 

    await orderInfo.save(function (err, result) {
        if(err) {
            console.log(err)
        } else {
            console.log(result)
        }
    })

    res.status(201).json({
        success: true,
        data: "Added successfully"
    })

        let txt = `We have received your order. Your order id is ${orderInfo.orderId}`
        let jsonStr = JSON.parse(proDetails)    
        let html = ''
        for(let i=0; i<jsonStr.length; i++) {
            const struct =   
            `
            <h3>Ordered Items</h3>
            <br>
            <p>Product: ${jsonStr[i].title}</p>
            <br>
            <p>Quantity: ${jsonStr[i].quantity}</p>
            <br>
            <p>Customer Email: ${orderInfo.email}</p>
            <br>
            <p>Customer City: ${orderInfo.city}</p>
            <br>
            <p>Customer State: ${orderInfo.state}</p>
            <br>
            `
            html += struct
        }
        let shipment = `<h3>Shipment address:</h3>
        <br>
        <p>Delivery Address: ${orderInfo.address}</p>`
    
    transport.sendMail(sendMail(orderInfo.email,txt,shipment,html),  function(err, info){
            if(err) {
                console.log(err)
            } else {
                console.log("Email Sent:" + info.response)
            }
        });   
})





function sendMail (recevier,text,ship,body) {
    const mailOption = {
    from: "mahmadshafiqbutt@gmail.com",
    to: recevier,
    subject: "Ahmad Store - Order Received",
    html: text + body + ship ,
    }
    return mailOption;
}


module.exports = router



// let odrID = orderInfo.orderId
    
    // const orderID = await order.findOne({
    //     orderId:  odrID 
    // })

