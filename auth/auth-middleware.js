const jwt = require('jsonwebtoken')

const Middleware = async function (req, res, next) {

  if (req.url === '/login' || req.url === '/signup') {
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
}

module.exports = Middleware;