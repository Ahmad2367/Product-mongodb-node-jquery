const express = require('express')
const router = express.Router()
const userValidation = require('../validation/signup-fields-validator')
const user = require('../Database/user-schema')
const jwt = require('jsonwebtoken')
const {
    v4: uuidv4
} = require('uuid');

router.post('/signup', async function (req, res) {

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

router.post('/login', async function (req, res) {

    const email = req.body.loginEmail
    const password = req.body.loginPassword
    const findFields = await user.find({
        email: email,
        password: password
    })
    req.headers['authorization']



    if (findFields.length > 0) {
        let accessToken = jwt.sign({
            clientID: findFields[0].userId
        }, process.env.Access_Token_Secret)

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

router.delete('/logout', async function (req, res) {
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

module.exports = router