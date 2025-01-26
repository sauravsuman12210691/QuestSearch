require('dotenv').config();
const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { searchQuestions } = require('./services/questionService');
const searchRoutes = require('./routes/searchRoutes');

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

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors()); // Allow cross-origin requests from frontend

// REST API routes
app.use('/api', searchRoutes);

// Start gRPC server
function startGrpcServer() {
  const server = new grpc.Server();

  // Add the service with its implementation
  server.addService(questionProto.service, { searchQuestions });

  // Bind the server to the specified port
  server.bindAsync(
    `0.0.0.0:${process.env.GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`gRPC server running on port ${port}`);
      server.start();
    }
  );
}

// Initialize MongoDB and start the servers
async function initializeApp() {
  await connectDB();
  startGrpcServer();

  app.listen(process.env.REST_PORT, () => {
    console.log(`Backend server running on http://localhost:${process.env.REST_PORT}`);
  });
}

initializeApp();
