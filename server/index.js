const express = require('express');

const cron = require('node-cron');
require('dotenv').config();
const cors = require('cors');
const weatherRoutes = require('./routes/weather');
const fetchWeatherData = require('./services/weatherService')
const PORT = process.env.PORT ;
const generateDailySummary = require('./controllers/dailySummaryController');

const connectDB = require('./config/db')

const app = express();
connectDB()
app.use(cors());
app.use(express.json());


app.use('/weather', weatherRoutes);

setInterval(fetchWeatherData, 3000000)




cron.schedule('0 * * * *', async () => { // At minute 0 of every hour
  console.log('Generating daily summaries (Hourly)...');
  await generateDailySummary();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
