const jwt = require('jsonwebtoken');
const config = require('./config');

const checkToken = async (ctx, next) => {
  const { token } = ctx.headers;
  let data = null;
  try {
    data = jwt.verify(token, config.jwtSalt, { ignoreExpiration: true })
  } catch (err) {
    ctx.throw(401, 'unauthorized');
  }


  if (data) {
    await next();
  } else {
    ctx.throw(401, 'unauthorized');
  }
};
module.exports = checkToken;
