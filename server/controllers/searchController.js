// backend/controllers/searchController.js
const axios = require('axios');

const searchQuestions = async (req, res) => {
  try {
    const { query } = req.body;

    // Call gRPC service to perform the search
    const grpcResponse = await axios.post(`http://localhost:${process.env.GRPC_PORT}`, {
      query: query,
    });

    // Return the search results to the frontend
    res.json(grpcResponse.data);
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { searchQuestions };
