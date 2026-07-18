const Stripe = require("stripe");
const config = require("./env");

module.exports = Stripe(config.stripeSecret);
