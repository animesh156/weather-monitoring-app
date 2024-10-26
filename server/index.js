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

// cron.schedule('*/5 * * * *', async () => {
//   console.log('Fetching weather data...');
//   const weatherData = await fetchWeatherData();
//   checkWeatherThresholds(weatherData);
// });

cron.schedule('*/10 * * * *', async () => {
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



setInterval(async () => {
  console.log('Fetching weather data...');
   await fetchWeatherData();
 
}, 10 * 10000); // 10 seconds


cron.schedule('*/4 * * * *', async () => {
  console.log('Generating daily summaries (Hourly)...');
   await generateDailySummary();
});


// cron.schedule('0 * * * *', async () => { // At minute 0 of every hour
//   console.log('Generating daily summaries (Hourly)...');
//   await generateDailySummary();
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
