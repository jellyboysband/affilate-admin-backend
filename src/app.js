const Koa = require('koa');
const bodyParser = require('koa-body');
const rabbit = require('amqplib');
const cors = require('@koa/cors');
const routes = require('./router');
const config = require('./config');

const app = new Koa();

app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization', 'token', 'id'],
    exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id'],
  }),
);
app.use(
  bodyParser({
    formLimit: '10mb',
    jsonLimit: '10mb',
    multipart: true,
    formidable: {
      // uploadDir: path.join(process.env.FRONT_PATH, process.env.UPLOAD_PATH),
      keepExtensions: true,
    },
  }),
);

app.use(routes);

rabbit
  .connect({
    username: 'rabbitmq',
    password: 'rabbitmq',
  })
  .then(async conn => {
    const ch = await conn.createChannel();
    app.context.rabbit = ch;

    app.context.sendQueue = await ch.assertQueue(config.sendQ, { durable: false });
    app.context.getQueue = await ch.assertQueue(config.getQ, { durable: false, ack: true });
    app.listen(config.port, () => {
      console.log(config.port);
    });
  });
