const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/riders — apply
const applyForRider = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    region,
    coverageDistrict,
    nid,
    bikeBrand,
    bikeRegNumber,
  } = req.body;

  if (!name || !email || !phone || !region) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const riders = getDB().collection("riders");

  const existing = await riders.findOne({ email });
  if (existing) {
    return res.status(409).json({
      success: false,
      message: `You already have a ${existing.status} application`,
    });
  }

  const result = await riders.insertOne({
    name,
    email,
    phone,
    region,
    coverageDistrict: coverageDistrict || null,
    nid: nid || null,
    bikeBrand: bikeBrand || null,
    bikeRegNumber: bikeRegNumber || null,
    status: "pending",
    appliedAt: new Date(),
  });

  res.status(201).json({ success: true, id: result.insertedId });
});

// GET /api/riders?status=pending
const getRiders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};
  if (status) query.status = status;

  const riders = await getDB()
    .collection("riders")
    .find(query)
    .sort({ appliedAt: -1 })
    .toArray();

  res.json({ success: true, count: riders.length, data: riders });
});

// PATCH /api/riders/:id/approve — TWO writes, ordered to fail safe
const approveRider = asyncHandler(async (req, res) => {
  const db = getDB();
  const riders = db.collection("riders");

  const application = await riders.findOne({
    _id: new ObjectId(req.params.id),
  });
  if (!application)
    return res
      .status(404)
      .json({ success: false, message: "Application not found" });

  if (application.status === "approved")
    return res
      .status(409)
      .json({ success: false, message: "Already approved" });

  // 1) mark the application approved FIRST
  await riders.updateOne(
    { _id: application._id },
    { $set: { status: "approved", approvedAt: new Date() } },
  );

  // 2) THEN grant the role in users
  const roleResult = await db
    .collection("users")
    .updateOne({ email: application.email }, { $set: { role: "rider" } });

  if (roleResult.matchedCount === 0)
    return res.status(404).json({
      success: false,
      message:
        "Application approved, but no user account exists for that email",
    });

  res.json({ success: true, message: `${application.email} is now a rider` });
});

// PATCH /api/riders/:id/reject
const rejectRider = asyncHandler(async (req, res) => {
  const result = await getDB()
    .collection("riders")
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: "rejected", rejectedAt: new Date() } },
    );

  if (result.matchedCount === 0)
    return res
      .status(404)
      .json({ success: false, message: "Application not found" });

  res.json({ success: true, message: "Application rejected" });
});

module.exports = { applyForRider, getRiders, approveRider, rejectRider };
