const { MongoClient, ServerApiVersion } = require("mongodb");
const config = require("./env");

let db;

async function connectDB() {
    const client = new MongoClient(config.mongoUri, {
        serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
    });
    await client.connect();
    db = client.db('dispatchDB')
    console.log('MongoDB connected')
    return db
}

function getDB() {
    if (!db) throw new Error('DB not connected — call connectDB() first');
    return db;
}

module.exports = {connectDB, getDB}