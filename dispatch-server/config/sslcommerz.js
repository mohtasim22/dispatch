const SSLCommerzPayment = require("sslcommerz-lts");
const config = require("./env");

// a fresh instance per call (it just wraps credentials)
const getSSLCZ = () =>
  new SSLCommerzPayment(config.sslczStoreId, config.sslczStorePass, config.sslczIsLive);

module.exports = getSSLCZ;
