const Router = require('koa-router');
const authMiddleware = require('./authMiddleware');
const jwt = require('jsonwebtoken');
const config = require('./config');

const router = new Router();

router.post('/admin/login', async ctx => {
  console.log('TCL: ctx', ctx);
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
  ctx.body = (await ctx.rabbit.get(config.getQ, { noAck: true })).content.toString();
});

router.post('/admin/product', authMiddleware, async ctx => {
  console.log(ctx.request.body);
  ctx.status = 200;
});
module.exports = router.routes();
