const { MongoClient, ServerApiVersion } = require("mongodb");
const config = require("./env");

let db;

async function connectDB() {
  const client = new MongoClient(config.mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  db = client.db("dispatchDB");
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db
    .collection("parcels")
    .createIndexes([
      { key: { trackingId: 1 }, unique: true },
      { key: { bookedBy: 1 } },
      { key: { createdAt: -1 } },
    ]);
  await db.collection("riders").createIndex({ email: 1 }, { unique: true });

  console.log("MongoDB connected");
  return db;
}

function getDB() {
  if (!db) throw new Error("DB not connected — call connectDB() first");
  return db;
}

module.exports = { connectDB, getDB };
