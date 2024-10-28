const express = require("express");

const cron = require("node-cron");
require("dotenv").config();
const cors = require("cors");
const weatherRoutes = require("./routes/weather");
const fetchWeatherData = require("./services/weatherService");
const PORT = process.env.PORT;
const generateDailySummary = require("./controllers/dailySummaryController");
const checkWeatherThresholds = require("./services/thresholdCheckerService");
const Weather = require("./models/weatherModel");

const connectDB = require("./config/db");

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use("/weather", weatherRoutes);

// Schedule to fetch weather data every 5 minutes
const fetchWeatherTask = async () => {
  console.log("Fetching weather data...");

  try {
    await fetchWeatherData(); // Call the fetch weather function
    console.log("Weather data fetched successfully.");
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }

  // Schedule the next execution after 5 minutes (5 * 60 * 1000 ms)
  setTimeout(fetchWeatherTask, 5 * 60 * 1000);
};

// Start the task on server initialization
fetchWeatherTask();

const checkWeatherTask = async () => {
  console.log("Checking weather thresholds...");

  try {
    const weatherData = await Weather.find(); // Fetch weather data

    if (weatherData.length > 0) {
      checkWeatherThresholds(weatherData); // Check thresholds
      console.log("Weather thresholds checked.");
    } else {
      console.log("No weather data available.");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }

  // Schedule the next execution after 30 minutes (30 * 60 * 1000 ms)
  setTimeout(checkWeatherTask, 30 * 60 * 1000);
};

// Start the task when the server starts
checkWeatherTask();

const generateSummaryTask = async () => {
  console.log("Generating daily summaries...");

  try {
    await generateDailySummary(); // Call the summary generation function
    console.log("Daily summary generated successfully.");
  } catch (error) {
    console.error("Error generating daily summary:", error);
  }

  // Schedule the next execution after 1 hour (60 * 60 * 1000 ms)
  setTimeout(generateSummaryTask, 60 * 60 * 1000);
};

// Start the task on server initialization
generateSummaryTask();

app.listen(PORT);
