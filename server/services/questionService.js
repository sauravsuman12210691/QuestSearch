// backend/services/questionService.js
const grpc = require('@grpc/grpc-js');
const { getDB } = require('../config/db');

// Load gRPC definition
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = './proto/questions.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const questionProto = grpc.loadPackageDefinition(packageDefinition).QuestionService;

// Implement the gRPC service
const searchQuestions = async (call, callback) => {
  try {
    const { query } = call.request;
    const db = getDB();

    // Perform the search query in MongoDB
    const questions = await db.collection('questions').find({
      title: { $regex: query, $options: 'i' },
    }).toArray();

    // Transform results to include ANAGRAM-specific data
    const formattedQuestions = questions.map((q) => {
      if (q.type === 'ANAGRAM') {
        return {
          id: q._id.toString(),
          type: q.type,
          title: q.title,
          blocks: q.blocks,
          solution: q.solution,
        };
      }
      return {
        id: q._id.toString(),
        type: q.type,
        title: q.title,
      };
    });

    callback(null, { questions: formattedQuestions });
  } catch (err) {
    console.error('Error in searchQuestions:', err);
    callback(err, null);
  }
};

module.exports = { searchQuestions };
