const express = require("express");
const { applyForRider, getRiders, approveRider, rejectRider } = require("../controllers/riderController");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();

router.post("/", verifyToken,  applyForRider);
router.get("/", verifyToken, verifyAdmin, getRiders);
router.patch("/:id/approve", verifyToken, verifyAdmin,  approveRider);
router.patch("/:id/reject", verifyToken, verifyAdmin, rejectRider);

module.exports = router;
