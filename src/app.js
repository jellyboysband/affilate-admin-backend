const Koa = require('koa');
// const KoaBody = require('koa-body');
const routes = require('./router');
const rabbit = require('amqplib');
const config = require('./config');





const app = new Koa()

// app.use(KoaBody);



app.use(routes)

rabbit.connect({
  username: 'rabbitmq',
  password: 'rabbitmq'
}).then(async conn => {
  conn.createChannel().then(ch => {
    app.context.rabbit = ch;
    ch.assertQueue(config.getQ, { durable: false, ack: true }).then(() => {

      app.listen(config.port, () => {
        console.log(config.port)
      });

    })
  })
}) 