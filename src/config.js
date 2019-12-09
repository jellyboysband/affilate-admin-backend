require('dotenv').config();
const config = {
  port: +process.env.PORT || 3000,
  rabbitUrl: process.env.RABBIT_URL || 'amqp://localhost',
  jwtSalt:
    process.env.JWT_SALT ||
    'mySuperSecretAwesomeSaltuhg87g8yvg67fyuF&^FCtd54dcytuf64dcytC^%DyctvgcD^Y%DCYTVcy65d5ty',
  jwtExpires: '365d',
  adminPassword: process.env.ADMIN_PASS || 'awesome777',
  getQ: process.env.GET_Q || 'documents_ali',
  sendQ: process.env.SEND_Q || 'filtered_products',
  postQ: process.env.POST_Q || 'ready_products',
  appId: process.env.APP_ID || 'affilateQ',
};

module.exports = config;
