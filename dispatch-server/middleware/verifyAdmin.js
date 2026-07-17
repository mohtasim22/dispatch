// verifyAdmin.js
const { getDB } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const user = await getDB().collection("users").findOne({ email: req.decoded?.email });

  if (user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: admin only" });
  }
  next();
});

module.exports = verifyAdmin;
