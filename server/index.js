require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { MongoClient, ObjectId } = require('mongodb');

// Load gRPC definition
const PROTO_PATH = './proto/questions.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const questionProto = grpc.loadPackageDefinition(packageDefinition).QuestionService;
console.log(questionProto);

// MongoDB client
let db;
async function connectDB() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db();
  console.log('Connected to MongoDB');
}

// Implement the gRPC service
async function searchQuestions(call, callback) {
  const { query, page = 1, limit = 10 } = call.request;
  const skip = (page - 1) * limit;

  try {
    const questions = await db
      .collection('questions')
      .find({ title: new RegExp(query, 'i') }) // Case-insensitive search
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('questions').countDocuments({ title: new RegExp(query, 'i') });

    callback(null, {
      questions: questions.map((q) => ({
        id: q._id.toString(),
        title: q.title,
        type: q.type,
      })),
      total,
      page,
      limit,
    });
  } catch (err) {
    callback(err, null);
  }
}

// Start gRPC server
function startServer() {
  const server = new grpc.Server();

  // Add the service with its implementation
  server.addService(questionProto.service, { searchQuestions });

  // Bind the server to the specified port
  server.bindAsync(`0.0.0.0:${process.env.PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`gRPC server running on port ${port}`);
    server.start();
  });
}
