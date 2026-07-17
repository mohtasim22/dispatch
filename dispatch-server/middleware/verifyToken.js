const { auth } = require("../config/firebase");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized: no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.decoded = await auth.verifyIdToken(token);  // { uid, email, ... }
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Unauthorized: invalid token" });
  }
};

module.exports = verifyToken;
