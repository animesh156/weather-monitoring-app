const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema({
  city: String,
  date: String,
  avgTemp: Number,
  maxTemp: Number,
  minTemp: Number,
  dominantCondition: String
});

module.exports = mongoose.model('Summary', SummarySchema);
