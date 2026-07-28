const { ObjectId } = require("mongodb");
const crypto = require("crypto");
const { getDB } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const getSSLCZ = require("../config/sslcommerz");
const config = require("../config/env");

const CLIENT = config.clientUrls[0];   // where to send the browser after payment

// POST /api/payments/init  (verifyToken) — start a payment
const initPayment = asyncHandler(async (req, res) => {
  const { parcelId } = req.body;
  if (!parcelId) return res.status(400).json({ success: false, message: "parcelId required" });

  const db = getDB();
  const parcel = await db.collection("parcels").findOne({ _id: new ObjectId(parcelId) });
  if (!parcel) return res.status(404).json({ success: false, message: "Parcel not found" });
  if (parcel.bookedBy !== req.decoded.email) return res.status(403).json({ success: false, message: "Not your parcel" });
  if (parcel.paymentStatus === "paid") return res.status(409).json({ success: false, message: "Already paid" });

  const tranId = `DSPPAY-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

  const data = {
    total_amount: parcel.cost,                 // ← amount from the DB, never the client
    currency: "BDT",
    tran_id: tranId,                           // unique — our correlation key
    success_url: `${config.serverUrl}/api/payments/success/${tranId}`,
    fail_url: `${config.serverUrl}/api/payments/fail/${tranId}`,
    cancel_url: `${config.serverUrl}/api/payments/cancel/${tranId}`,
    ipn_url: `${config.serverUrl}/api/payments/ipn`,
    shipping_method: "Courier",
    product_name: parcel.title,
    product_category: "Delivery",
    product_profile: "general",
    cus_name: parcel.pickup?.contactName || "Customer",
    cus_email: req.decoded.email,
    cus_add1: parcel.pickup?.address || "Dhaka",
    cus_city: parcel.pickup?.district || "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: parcel.pickup?.contactPhone || "01700000000",
    ship_name: parcel.delivery?.contactName || "Receiver",
    ship_add1: parcel.delivery?.address || "Dhaka",
    ship_city: parcel.delivery?.district || "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const sslcz = getSSLCZ();
  const apiResponse = await sslcz.init(data);

  if (!apiResponse?.GatewayPageURL) {
    return res.status(502).json({ success: false, message: "Payment init failed", detail: apiResponse?.failedreason });
  }

  // record a pending payment so the callback can find the parcel by tranId
  await db.collection("payments").insertOne({
    tranId, parcelId: parcel._id, trackingId: parcel.trackingId,
    email: req.decoded.email, amount: parcel.cost, currency: "BDT",
    status: "pending", createdAt: new Date(),
  });

  res.json({ success: true, url: apiResponse.GatewayPageURL });   // client redirects here
});

// shared: validate + mark paid (used by success AND ipn — must be idempotent)
const finalizePayment = async (tranId, body) => {
  const db = getDB();
  const payment = await db.collection("payments").findOne({ tranId });
  if (!payment) return false;
  if (payment.status === "paid") return true;   // idempotent — already done

  // server-to-server validation with SSLCommerz
  let ok = false;
  if (body?.val_id) {
    const v = await getSSLCZ().validate({ val_id: body.val_id });
    ok = v?.status === "VALID" || v?.status === "VALIDATED";
  }
  if (!ok) return false;

  const now = new Date();
  await db.collection("payments").updateOne(
    { tranId },
    { $set: { status: "paid", valId: body.val_id, paidAt: now } }
  );
  await db.collection("parcels").updateOne(
    { _id: payment.parcelId },
    { $set: { paymentStatus: "paid" },
      $push: { trackingHistory: { status: "payment", message: "Payment received", at: now } } }
  );
  return true;
};

// POST /api/payments/success/:tranId  (PUBLIC — SSLCommerz calls it)
const paymentSuccess = asyncHandler(async (req, res) => {
  const ok = await finalizePayment(req.params.tranId, req.body);
  res.redirect(ok ? `${CLIENT}/payment/success?tran=${req.params.tranId}` : `${CLIENT}/payment/fail`);
});

// POST /api/payments/ipn  (PUBLIC — server-to-server, the reliable path)
const paymentIPN = asyncHandler(async (req, res) => {
  await finalizePayment(req.body.tran_id, req.body);
  res.status(200).json({ received: true });   // no redirect — it's server-to-server
});

// POST /api/payments/fail/:tranId  (PUBLIC)
const paymentFail = asyncHandler(async (req, res) => {
  await getDB().collection("payments").updateOne({ tranId: req.params.tranId }, { $set: { status: "failed" } });
  res.redirect(`${CLIENT}/payment/fail`);
});

// POST /api/payments/cancel/:tranId  (PUBLIC)
const paymentCancel = asyncHandler(async (req, res) => {
  await getDB().collection("payments").updateOne({ tranId: req.params.tranId }, { $set: { status: "cancelled" } });
  res.redirect(`${CLIENT}/payment/cancel`);
});

// GET /api/payments?email=  (verifyToken) — payment history
const getPayments = asyncHandler(async (req, res) => {
  const q = { status: "paid" };
  if (req.query.email) q.email = req.query.email;
  const data = await getDB().collection("payments").find(q).sort({ paidAt: -1 }).toArray();
  res.json({ success: true, data });
});

module.exports = { initPayment, paymentSuccess, paymentIPN, paymentFail, paymentCancel, getPayments };
