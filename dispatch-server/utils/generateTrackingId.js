const crypto = require("crypto");

// e.g. "DSP-9F3A7C" — short, human-readable, hard to guess
const generateTrackingId = () =>
  `DSP-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

module.exports = generateTrackingId;
