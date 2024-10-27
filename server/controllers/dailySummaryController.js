const Weather = require('../models/weatherModel');
const Summary = require('../models/dailySummaryModel');

const generateDailySummary = async () => {
  try {
    const cities = await Weather.distinct('city'); // Get all unique cities
    const today = new Date().toISOString().split('T')[0]; // Current date (YYYY-MM-DD)

    for (const city of cities) {
      const weatherData = await Weather.find({
        city,
        timestamp: {
          $gte: new Date(`${today}T00:00:00Z`),
          $lt: new Date(`${today}T23:59:59Z`),
        },
      });

      if (weatherData.length === 0) continue;

      // Calculate aggregate values
      const avgTemp =
        weatherData.reduce((sum, entry) => sum + entry.temp, 0) /
        weatherData.length;
      const maxTemp = Math.max(...weatherData.map((entry) => entry.temp));
      const minTemp = Math.min(...weatherData.map((entry) => entry.temp));
      const avgHumidity =
        weatherData.reduce((sum, entry) => sum + entry.humidity, 0) /
        weatherData.length;
      const avgWindSpeed =
        weatherData.reduce((sum, entry) => sum + entry.wind_speed, 0) /
        weatherData.length;

      // Get the dominant condition and icon
      const conditionCounts = weatherData.reduce((counts, entry) => {
        counts[entry.main] = (counts[entry.main] || 0) + 1;
        return counts;
      }, {});
      const dominantCondition = Object.keys(conditionCounts).reduce((a, b) =>
        conditionCounts[a] > conditionCounts[b] ? a : b
      );

      const iconCounts = weatherData.reduce((counts, entry) => {
        counts[entry.icon] = (counts[entry.icon] || 0) + 1;
        return counts;
      }, {});
      const dominantIcon = Object.keys(iconCounts).reduce((a, b) =>
        iconCounts[a] > iconCounts[b] ? a : b
      );

      // Check if a summary for the current date already exists
      let summary = await Summary.findOne({ city, date: today });

      if (!summary) {
        // Create a new summary for the current date
        summary = new Summary({
          city,
          date: today,
          avgTemp: parseFloat(avgTemp.toFixed(2)),
          maxTemp,
          minTemp,
          avgHumidity: parseFloat(avgHumidity.toFixed(2)),
          avgWindSpeed: parseFloat(avgWindSpeed.toFixed(2)),
          dominantCondition,
          icon: dominantIcon,
        });
        await summary.save();
        console.log(`New summary created for ${city} on ${today}`);
      } else {
        // Update the existing summary for the current date
        summary.avgTemp = parseFloat(avgTemp.toFixed(2));
        summary.maxTemp = maxTemp;
        summary.minTemp = minTemp;
        summary.avgHumidity = parseFloat(avgHumidity.toFixed(2));
        summary.avgWindSpeed = parseFloat(avgWindSpeed.toFixed(2));
        summary.dominantCondition = dominantCondition;
        summary.icon = dominantIcon;

        await summary.save();
        console.log(`Summary updated for ${city} on ${today}`);
      }
    }
  } catch (error) {
    console.error('Error generating daily summary:', error);
  }
};

module.exports = generateDailySummary;
