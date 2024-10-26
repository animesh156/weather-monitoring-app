const express = require('express');
const Weather = require('../models/weatherModel');
const Summary = require('../models/dailySummaryModel');

const router = express.Router();

// Get daily summaries
router.get('/summaries', async (req, res) => {
  const summaries = await Summary.find();
  res.json(summaries);
});

router.get('/', async (req,res) => {
  const weatherData = await Weather.find()
  res.json(weatherData)
})

// Get recent alerts (if any)
router.get('/alerts', async (req, res) => {
  const alerts = await Weather.find({ temp: { $gt: 35 } }).limit(10);
  res.json(alerts);
});

module.exports = router;
