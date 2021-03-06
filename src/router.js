const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');
const config = require('./config');

const router = new Router();

router.post('/admin/login', async ctx => {
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
router.get('/admin/product', authMiddleware, async ctx => {
  const product = (await ctx.rabbit.get(config.getQ, { noAck: true })).content;
  if (product) {
    ctx.body = product.toString();
  } else {
    ctx.throw(404, 'Q is empty');
  }
});

router.post('/admin/product', authMiddleware, async ctx => {
  const result = ctx.request.body;
  await ctx.rabbit.sendToQueue(config.sendQ, Buffer.from(JSON.stringify(result)), {
    appId: config.appId,
    contentType: 'application/json',
  });
  ctx.body = {};
});

router.get('/admin/dashboard', authMiddleware, async ctx => {
  ctx.sendQueue = await ctx.rabbit.checkQueue(ctx.sendQueue.queue);
  ctx.getQueue = await ctx.rabbit.checkQueue(ctx.getQueue.queue);
  ctx.postQueue = await ctx.rabbit.checkQueue(ctx.postQueue.queue);
  ctx.body = {
    sendQ: ctx.sendQueue.messageCount,
    getQ: ctx.getQueue.messageCount,
    postQ: ctx.postQueue.messageCount,
  };
});
module.exports = router.routes();
