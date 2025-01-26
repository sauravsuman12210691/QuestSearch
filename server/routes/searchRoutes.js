// backend/routes/searchRoutes.js
const express = require('express');
const { searchQuestions } = require('../controllers/searchController');

const router = express.Router();

router.post('/search', searchQuestions);

module.exports = router;
