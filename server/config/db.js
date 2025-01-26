// backend/config/db.js
const { MongoClient } = require("mongodb");

let db;

async function connectDB() {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    db = client.db();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };
