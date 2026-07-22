function required(key) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

const config = {
    port : process.env.PORT || 5000,
    clientUrls: (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim()),
    mongoUri: required('MONGO_URI'),
    stripeSecret: required("STRIPE_SECRET_KEY")
}

module.exports = config