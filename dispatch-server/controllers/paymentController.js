const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const stripe = require("../config/stripe");

// POST /api/payments/create-intent
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { parcelId } = req.body;
  if (!parcelId)
    return res.status(400).json({ success: false, message: "parcelId is required" });

  const parcel = await getDB().collection("parcels").findOne({ _id: new ObjectId(parcelId) });
  if (!parcel)
    return res.status(404).json({ success: false, message: "Parcel not found" });

  // only the person who booked it may pay for it
  if (parcel.bookedBy !== req.decoded.email)
    return res.status(403).json({ success: false, message: "Not your parcel" });

  if (parcel.paymentStatus === "paid")
    return res.status(409).json({ success: false, message: "Parcel already paid" });

  const amount = Math.round(parcel.cost * 100);   // ← DB cost, in the smallest unit

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata: {
      parcelId: parcel._id.toString(),
      trackingId: parcel.trackingId,
      email: parcel.bookedBy,
    },
  });

  res.json({ success: true, clientSecret: intent.client_secret, amount });
});

// POST /api/payments — record AFTER the client confirms
const recordPayment = asyncHandler(async (req, res) => {
  const { parcelId, transactionId } = req.body;
  if (!parcelId || !transactionId)
    return res.status(400).json({ success: false, message: "parcelId and transactionId are required" });

  // 🔑 NEVER trust "I paid" — ask Stripe directly
  const intent = await stripe.paymentIntents.retrieve(transactionId);
  if (intent.status !== "succeeded")
    return res.status(400).json({ success: false, message: `Payment not succeeded (status: ${intent.status})` });

  const db = getDB();
  const payments = db.collection("payments");

  // idempotent — a retry must not double-record
  const existing = await payments.findOne({ transactionId });
  if (existing)
    return res.status(200).json({ success: true, message: "Payment already recorded" });

  const parcel = await db.collection("parcels").findOne({ _id: new ObjectId(parcelId) });
  if (!parcel)
    return res.status(404).json({ success: false, message: "Parcel not found" });

  const now = new Date();

  await payments.insertOne({
    parcelId: parcel._id,
    trackingId: parcel.trackingId,
    email: req.decoded.email,
    amount: intent.amount / 100,
    currency: intent.currency,
    transactionId,
    paidAt: now,
  });

  await db.collection("parcels").updateOne(
    { _id: parcel._id },
    {
      $set: { paymentStatus: "paid" },
      $push: { trackingHistory: { status: parcel.deliveryStatus, message: "Payment received", at: now } },
    }
  );

  res.status(201).json({ success: true, message: "Payment recorded" });
});

// GET /api/payments?email=
const getPayments = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.email) query.email = req.query.email;

  const data = await getDB().collection("payments").find(query).sort({ paidAt: -1 }).toArray();
  res.json({ success: true, count: data.length, data });
});

module.exports = { createPaymentIntent, recordPayment, getPayments };
