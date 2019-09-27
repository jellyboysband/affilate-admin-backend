
const config = require('./config');
const jwt = require('jsonwebtoken');


const checkToken = async (ctx, next) => {
  const { token } = ctx.headers
  if (jwt.verify(token, config.jwtSalt)) {
    await next()
  } else {
    ctx.throw(401, 'access denied')
  }
}


module.exports = checkToken