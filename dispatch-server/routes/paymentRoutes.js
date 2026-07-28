const express = require("express");
const { initPayment, paymentSuccess, paymentIPN, paymentFail, paymentCancel, getPayments } = require("../controllers/paymentController");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post("/init", verifyToken, initPayment);   // guarded — user starts payment
router.post("/success/:tranId", paymentSuccess);  // PUBLIC — SSLCommerz has no token
router.post("/fail/:tranId", paymentFail);
router.post("/cancel/:tranId", paymentCancel);
router.post("/ipn", paymentIPN);
router.get("/", verifyToken, getPayments);

module.exports = router;
