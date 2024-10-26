const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema({
  city: String,
  date: String,
  avgTemp: Number,
  maxTemp: Number,
  minTemp: Number,
  avgWindSpeed: Number,
  avgHumidity: Number,
  dominantCondition: String,
  icon: String  
});

module.exports = mongoose.model('Summary', SummarySchema);
