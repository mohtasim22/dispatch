const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const saveUser = asyncHandler(async (req, res) => {
  const { name, email, photoURL } = req.body;
  const users = getDB().collection("users");

  const existing = await users.findOne({ email });
  if (existing) {
    await users.updateOne({ email }, { $set: { lastLoggedIn: new Date() } });
    return res.status(200).json({
      success: true,
      inserted: false,
      message: "User already exists",
    });
  }

  const result = await users.insertOne({
    name,
    email,
    photoURL: photoURL || null,
    role: "user",
    createdAt: new Date(),
    lastLoggedIn: new Date(),
  });
  res.status(201).json({
    success: true,
    inserted: true,
    id: result.insertedId,
    message: "User successfully created",
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getDB()
    .collection("users")
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  res.json({ success: true, data: users });
});

const getUserRole = asyncHandler(async (req, res) => {
  const user = await getDB()
    .collection("users")
    .findOne({ email: req.params.email });
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, role: user.role });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const result = await getDB()
    .collection("users")
    .updateOne(
      { _id: new ObjectId(req.params.id) }, // ← string id → ObjectId
      { $set: { role } },
    );
  res.json({ success: true, modified: result.modifiedCount });
});

module.exports = { saveUser, getAllUsers, getUserRole, updateUserRole };
