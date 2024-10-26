const axios = require('axios');
const Weather = require('../models/weatherModel');

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const API_KEY = process.env.OPENWEATHER_API_KEY;

const fetchWeatherData = async () => {
  try {
    for (const city of cities) {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      const { main, weather, dt } = response.data;

      const weatherData = new Weather({
        city,
        main: weather[0].main,
        temp: main.temp,
        feels_like: main.feels_like,
        timestamp: new Date(dt * 1000)
      });

      await weatherData.save();
      console.log(`Weather data saved for ${city}`);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

module.exports = fetchWeatherData;