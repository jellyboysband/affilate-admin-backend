const jwt = require('jsonwebtoken');
const config = require('./config');

const checkToken = async (ctx, next) => {
  const { token } = ctx.headers;
  try {
    if (jwt.verify(token, config.jwtSalt)) {
      await next();
    } else {
      ctx.throw(401, 'unauthorized');
    }
  } catch (err) {

    ctx.throw(401, 'unauthorized');
  }
};
module.exports = checkToken;
