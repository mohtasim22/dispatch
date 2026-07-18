const express = require("express");
const { createPaymentIntent, recordPayment, getPayments } = require("../controllers/paymentController");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post("/create-intent", verifyToken, createPaymentIntent);
router.post("/", verifyToken, recordPayment);
router.get("/", verifyToken, getPayments);

module.exports = router;
