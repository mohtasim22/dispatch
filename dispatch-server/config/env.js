function required(key) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

const config = {
    port : process.env.PORT || 5000,
    clientUrl : process.env.CLIENT_URL || "http://localhost:5173",
    mongoUri: required('MONGO_URI'),
}

module.exports = config