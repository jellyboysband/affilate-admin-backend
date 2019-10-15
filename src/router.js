const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');
const config = require('./config');

const router = new Router();

router.post('/admin/login', async (ctx) => {

  const { password } = ctx.request.body;
  if (password === config.adminPassword) {
    ctx.body = {
      token: jwt.sign({ timestamp: Date.now() }, config.jwtSalt, { expiresIn: config.jwtExpires }),
    };
  } else {
    ctx.throw(403, 'Password Incorrect');
  }
});


// router.get('/product', authMiddleware, async ctx => {
router.get('/admin/product', authMiddleware, async (ctx) => {
  const product = (await ctx.rabbit.get(config.getQ, { noAck: true })).content
  if (product) {
    ctx.body = product.toString();
  } else {
    ctx.throw(404, 'Q is empty')
  }

});

// router.get('/product', authMiddleware, async ctx => {
router.get('/admin/product', authMiddleware, async ctx => {
  ctx.body = (await ctx.rabbit.get(config.getQ, { noAck: true })).content.toString();
});

router.post('/admin/product', authMiddleware, async ctx => {
  const result = ctx.request.body;
  await ctx.rabbit.sendToQueue(config.sendQ, Buffer.from(JSON.stringify(result)))
  ctx.body = {}
});
module.exports = router.routes();
