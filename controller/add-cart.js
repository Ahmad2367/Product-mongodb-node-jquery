const express = require('express');
const router = express.Router();
const product = require('../Database/product-schema')

router.post('/add', (req,res) => {
   let sessionObj = req.session;
   if(sessionObj.cart)
   {
      sessionObj.cart.push({ 
         productId: req.query.id,
         quantity: req.query.quantity
      });
   }
   else{
      sessionObj.cart =[{ 
         productId: req.query.id,
         quantity: req.query.quantity
      }];
   }
      
   return res.json({
        success: true,
        value : sessionObj.cart

     })
})

router.get('/get', async (req,res)=> {
   
      try {
         let cartItems =  req.session.cart;
         if(!cartItems) {
          return  res.json ({
               success: false,
               data: []
            });
         }
         let proArr = []
         for(let i=0; i<cartItems.length; i++) {
            let productID = cartItems[i].productId
            const proObj = await product.findOne({
               productId: productID
            }).exec();
            proObj.quantity = cartItems[i].quantity
            proArr.push(proObj);
         }
         
         const newProArr = proArr.map((item) => {
            return {
                  productId: item.productId,
                  title: item.title,
                  price: item.price,
                  img: item.img,
                  quantity: item.quantity,
                  totalPrice: item.quantity * item.price
            }
         })

         let cartObj = {
            products: newProArr,
            totalPrice: newProArr.map(i => i.totalPrice).reduce((prev, next) => prev + next)
         }

         res.json({

            success: true,
            data: cartObj
         })
      }
      catch(err) {
         console.log(err)
      }
})


 module.exports = router;