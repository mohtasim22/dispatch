const express = require("express");
const {
  bookParcel,
  getParcels,
  getParcelById,
  updateParcelStatus,
  assignRider,
  cancelParcel,
} = require("../controllers/parcelController");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyRider = require("../middleware/verifyRider");
const router = express.Router();

router.post("/", verifyToken, bookParcel);
router.get("/", verifyToken, getParcels);
router.get("/:id", verifyToken, getParcelById);
router.patch("/:id/status", verifyToken, verifyRider, updateParcelStatus);
router.patch("/:id/assign", verifyToken, verifyAdmin, assignRider);
router.delete("/:id", verifyToken, cancelParcel);

module.exports = router;
