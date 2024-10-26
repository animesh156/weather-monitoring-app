const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
  city: String,
  main: String,
  icon: String, // Store the weather icon code
  temp: Number,
  feels_like: Number,
  humidity: Number, // Humidity percentage
  wind_speed: Number, // Wind speed in m/s
  
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Weather', WeatherSchema);
