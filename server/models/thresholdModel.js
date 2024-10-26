const mongoose = require('mongoose');

const ThresholdSchema = new mongoose.Schema({
  city: String,
  tempThreshold: Number,
  weatherCondition: String,
  alertTriggered: { type: Boolean, default: false }
});

module.exports = mongoose.model('Threshold', ThresholdSchema);
