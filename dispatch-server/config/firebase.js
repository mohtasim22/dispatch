const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const serviceAccount = require("../firebase-admin-key.json");

// guard against double-init on nodemon restarts
if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const auth = getAuth();

module.exports = { auth };
