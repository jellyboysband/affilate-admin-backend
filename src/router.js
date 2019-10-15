const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');
const config = require('./config');

const router = new Router();

router.post('/admin/login', async (ctx) => {

  const { password } = ctx.request.body;
  if (password === config.adminPassword) {
    ctx.body = { token: jwt.sign({ timestamp: Date.now() }, config.jwtSalt, { expiresIn: config.jwtExpires }) };
  } else {
    ctx.throw(403, 'Password Incorrect');
  }
});

router.get('/', (ctx) => {
  console.log('kek');
});

// router.get('/product', authMiddleware, async ctx => {
router.get('/admin/product', async (ctx) => {
  ctx.body = (await ctx.rabbit.get(config.getQ, { noAck: true })).content.toString();
});

router.post('/admin/product', async (ctx) => {
  const result = ctx.request.body;
  console.log("TCL: result", result)
  await ctx.rabbit.sendToQueue(config.sendQ, Buffer.from(result))
  ctx.body = {}
});
module.exports = router.routes();
