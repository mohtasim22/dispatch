// verifyRider.js — riders OR admins may update delivery status
const { getDB } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const verifyRider = asyncHandler(async (req, res, next) => {
  const user = await getDB().collection("users").findOne({ email: req.decoded?.email });

  if (user?.role !== "rider" && user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: riders only" });
  }
  next();
});

module.exports = verifyRider;
