const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

(async function loadData() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db();
  const questions = JSON.parse(fs.readFileSync('./questions.json', 'utf-8'));
  
  await db.collection('questions').insertMany(questions);
  console.log('Data imported successfully!');
  client.close();
})();
