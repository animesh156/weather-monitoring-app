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
      const avgHumidity = weatherData.reduce((sum, entry) => sum + entry.humidity, 0) / weatherData.length;
      const avgWindSpeed = weatherData.reduce((sum, entry) => sum + entry.wind_speed, 0) / weatherData.length;

      // Calculate the dominant weather condition
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

      // Check if a summary for today exists
      const existingSummary = await Summary.findOne({ city, date: today });

      // Get the last summary (if exists) to check the date
      const lastSummary = await Summary.findOne({ city }).sort({ date: -1 });

      if (lastSummary) {
        const lastDate = lastSummary.date;

        if (lastDate !== today) {
          // If the date has changed, create a new summary
          const newSummary = new Summary({
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

          await newSummary.save();
          console.log(`New summary created for ${city} on ${today}`);
        } else {
          // If it's the same date, update the existing summary
          existingSummary.avgTemp = parseFloat(avgTemp.toFixed(2));
          existingSummary.maxTemp = maxTemp;
          existingSummary.minTemp = minTemp;
          existingSummary.avgHumidity = parseFloat(avgHumidity.toFixed(2));
          existingSummary.avgWindSpeed = parseFloat(avgWindSpeed.toFixed(2));
          existingSummary.dominantCondition = dominantCondition;
          existingSummary.icon = dominantIcon;
          await existingSummary.save();
          console.log(`Summary updated for ${city} on ${today}`);
        }
      } else {
        // If no last summary exists, create a new summary for today
        const newSummary = new Summary({
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

        await newSummary.save();
        console.log(`New summary created for ${city} on ${today}`);
      }
    }
  } catch (error) {
    console.error('Error generating daily summary:', error);
  }
};

module.exports = generateDailySummary;
