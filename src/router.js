const Router = require('koa-router');
const authMiddleware = require('./authMiddleware');
const jwt = require('jsonwebtoken');
const config = require('./config');

const router = new Router();

router.post('/login', async ctx => {
  const { password } = ctx.request.body();
  if (password === config.adminPassword) {
    ctx.body = { token: jwt.sign({ timestamp: Date.now() }, config.jwtSalt, { expiresIn: config.jwtExpires }) };
  } else {
    ctx.throw(403, 'Password Incorrect')
  }
})

router.get('/', ctx => {
  console.log('kek')
})

// router.get('/product', authMiddleware, async ctx => {
router.get('/product', async ctx => {

  ctx.body = (await ctx.rabbit.get(config.getQ, { noAck: true })).content.toString()
})


module.exports = router.routes();