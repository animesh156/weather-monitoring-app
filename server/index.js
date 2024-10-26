const express = require('express');

const cron = require('node-cron');
require('dotenv').config();
const cors = require('cors');
const weatherRoutes = require('./routes/weather');
const fetchWeatherData = require('./services/weatherService')
const PORT = process.env.PORT ;
const generateDailySummary = require('./controllers/dailySummaryController');
const checkWeatherThresholds = require('./services/thresholdCheckerService');
const Weather = require('./models/weatherModel');

const connectDB = require('./config/db')

const app = express();
connectDB()
app.use(cors());
app.use(express.json());


app.use('/weather', weatherRoutes);


cron.schedule('*/30 * * * *', async () => {
  console.log('Checking weather thresholds...');

  try {
    const weatherData = await Weather.find(); // Fetch weather data

    if (weatherData.length > 0) {
      checkWeatherThresholds(weatherData); // Check thresholds
    } else {
      console.log('No weather data available.');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
});





// Schedule to fetch weather data every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  // console.log('Fetching weather data every 5 minutes...');
  try {
    await fetchWeatherData();
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
});





cron.schedule('0 * * * *', async () => { // At minute 0 of every hour
  console.log('Generating daily summaries (Hourly)...');
  await generateDailySummary();
});

app.listen(PORT);
