const express = require("express");
const { saveUser, getAllUsers, getUserRole, updateUserRole } = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router()


router.post("/", saveUser);
router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.get("/:email/role", verifyToken, getUserRole);
router.patch("/:id/role", verifyToken, verifyAdmin, updateUserRole);

module.exports = router;