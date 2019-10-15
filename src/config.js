const config = {
  port: 3000,
  rabbitUrl: 'amqp://localhost',
  jwtSalt:
    'mySuperSecretAwesomeSaltuhg87g8yvg67fyuF&^FCtd54dcytuf64dcytC^%DyctvgcD^Y%DCYTVcy65d5ty',
  jwtExpires: '365d',
  adminPassword: 'awesome777',
  getQ: 'documents_ali',
  sendQ: 'filtered_products',
};

module.exports = config;
