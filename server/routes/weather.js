const express = require('express');
const Weather = require('../models/weatherModel');
const Summary = require('../models/dailySummaryModel');


const router = express.Router();

// Get all  summaries
router.get('/summaries', async (req, res) => {
  try {
    // Fetch all summaries from the database
    const summaries = await Summary.find();

    if (summaries.length === 0) {
      return res.status(404).json({ message: 'No summaries available.' });
    }

    // Send all summaries as the response
    res.json(summaries);
  } catch (error) {
    console.error('Error fetching summaries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});









router.get('/', async (req,res) => {
  const weatherData = await Weather.find()

  res.json(weatherData) 
})

// Get recent alerts (if any)

module.exports = router;
