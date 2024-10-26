const Weather = require('../models/weatherModel');
const Summary = require('../models/dailySummaryModel');



const generateDailySummary = async () => {
  try {
    // Get all unique cities from weather data
    const cities = await Weather.distinct('city');

    const today = new Date().toISOString().split('T')[0]; // Current date (YYYY-MM-DD)

    for (const city of cities) {
      // Fetch today's weather data for the city
      const weatherData = await Weather.find({
        city,
        timestamp: { 
          $gte: new Date(`${today}T00:00:00Z`), 
          $lt: new Date(`${today}T23:59:59Z`) 
        }
      });

      if (weatherData.length === 0) continue;

      // Calculate aggregate values
      const avgTemp = (weatherData.reduce((sum, entry) => sum + entry.temp, 0)) / weatherData.length;
      const maxTemp = Math.max(...weatherData.map(entry => entry.temp));
      const minTemp = Math.min(...weatherData.map(entry => entry.temp));

      // Calculate the dominant weather condition
      const conditionCounts = weatherData.reduce((counts, entry) => {
        counts[entry.main] = (counts[entry.main] || 0) + 1;
        return counts;
      }, {});
      const dominantCondition = Object.keys(conditionCounts).reduce((a, b) => 
        conditionCounts[a] > conditionCounts[b] ? a : b
      );

      // Check if a summary for today exists
      const existingSummary = await Summary.findOne({ city, date: today });

      if (existingSummary) {
        // Update the existing summary
        existingSummary.avgTemp = parseFloat(avgTemp.toFixed(2));
        existingSummary.maxTemp = maxTemp;
        existingSummary.minTemp = minTemp;
        existingSummary.dominantCondition = dominantCondition;
        await existingSummary.save();
        console.log(`Summary updated for ${city} on ${today}`);
      } else {
        // Store a new summary in the database
        const summary = new Summary({
          city,
          date: today,
          avgTemp: parseFloat(avgTemp.toFixed(2)),
          maxTemp,
          minTemp,
          dominantCondition
        });

        await summary.save();
        console.log(`Summary created for ${city} on ${today}`);
      }
    }
  } catch (error) {
    console.error('Error generating daily summary:', error);
  }
};

module.exports = generateDailySummary;
