const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const calculateCost = require("../utils/calculateCost");
const generateTrackingId = require("../utils/generateTrackingId");

const bookParcel = asyncHandler(async (req, res) => {
  const { parcelType, title, weight, pickup, delivery} = req.body;
  const bookedBy = req.decoded.email

  if (
    !title ||
    !weight ||
    !pickup?.district ||
    !delivery?.district
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required parcel fields" });
  }

  const cost = calculateCost(
    Number(weight),
    pickup.district,
    delivery.district,
  );
  const now = new Date();

  const parcel = {
    trackingId: generateTrackingId(),
    parcelType: parcelType || "box",
    title,
    weight: Number(weight),
    bookedBy,
    pickup,
    delivery,
    cost, 
    deliveryStatus: "pending",
    paymentStatus: "unpaid",
    assignedRider: null,
    createdAt: now,
    trackingHistory: [{ status: "pending", message: "Parcel booked", at: now }],
  };
  const result = await getDB().collection("parcels").insertOne(parcel);
  res.status(201).json({
    success: true,
    id: result.insertedId,
    trackingId: parcel.trackingId,
    cost,
  });
});

const getParcels = asyncHandler(async (req, res) => {
  const { email, status } = req.query;
  const query = {};

  if (email) query.bookedBy = email;
  if (status) query.deliveryStatus = status;

  const parcels = await getDB()
    .collection("parcels")
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  res.json({ success: true, count: parcels.length, data: parcels });
});

const getParcelById = asyncHandler(async (req, res) => {
  const parcel = await getDB()
    .collection("parcels")
    .findOne({ _id: new ObjectId(req.params.id) });

  if (!parcel)
    return res
      .status(404)
      .json({ success: false, message: "Parcel not found" });
  res.json({ success: true, data: parcel });
});

const ALLOWED_STATUSES = ["pending", "in-transit", "delivered", "cancelled"];

const updateParcelStatus = asyncHandler(async (req, res) => {
  const { status, message } = req.body;
  const { id } = req.params;

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }
  const now = new Date();
  const result = await getDB()
    .collection("parcels")
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { deliveryStatus: status },
        $push: {
          trackingHistory: {
            status,
            message: message || `Status changed to ${status}`,
            at: now,
          },
        },
      },
    );
  if (result.matchedCount === 0)
    return res
      .status(404)
      .json({ success: false, message: "Parcel not found" });

  res.json({ success: true, status });
});

const assignRider = asyncHandler(async (req, res) => {
  const { riderEmail } = req.body;
  if (!riderEmail)
    return res
      .status(400)
      .json({ success: false, message: "riderEmail is required" });

  // Mongo has no foreign keys — WE enforce integrity here
  const rider = await getDB()
    .collection("users")
    .findOne({ email: riderEmail, role: "rider" });

  if (!rider)
    return res
      .status(404)
      .json({ success: false, message: "No rider found with that email" });

  const now = new Date();
  const result = await getDB()
    .collection("parcels")
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: { assignedRider: riderEmail, deliveryStatus: "in-transit" },
        $push: {
          trackingHistory: {
            status: "in-transit",
            message: `Assigned to rider ${riderEmail}`,
            at: now,
          },
        },
      },
    );

  if (result.matchedCount === 0)
    return res
      .status(404)
      .json({ success: false, message: "Parcel not found" });

  res.json({ success: true, assignedRider: riderEmail });
});

const cancelParcel = asyncHandler(async (req, res) => {
  const parcels = getDB().collection("parcels");
  const parcel = await parcels.findOne({ _id: new ObjectId(req.params.id) });

  if (!parcel)
    return res
      .status(404)
      .json({ success: false, message: "Parcel not found" });

  if (parcel.deliveryStatus === "delivered")
    return res
      .status(409)
      .json({
        success: false,
        message: "A delivered parcel can't be cancelled",
      });

  const now = new Date();
  await parcels.updateOne(
    { _id: parcel._id },
    {
      $set: { deliveryStatus: "cancelled" },
      $push: {
        trackingHistory: {
          status: "cancelled",
          message: "Parcel cancelled",
          at: now,
        },
      },
    },
  );

  res.json({ success: true, message: "Parcel cancelled" });
});
module.exports = {
  bookParcel,
  getParcels,
  getParcelById,
  updateParcelStatus,
  assignRider,
  cancelParcel,
};
