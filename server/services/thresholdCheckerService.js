const breachedCities = {};

function checkWeatherThresholds(weatherData) {
  const temperatureThreshold = 15; // Temperature threshold

  weatherData.forEach((data) => {
    const { city, temp } = data;

    // Initialize breach count for the city if not already present
    if (!breachedCities[city]) {
      breachedCities[city] = 0;
    }

    // Check if the temperature exceeds the threshold
    if (temp > temperatureThreshold) {
      breachedCities[city] += 1; // Increment breach count
      console.log(`Breach detected for ${city}: ${temp}°C`);

      // Trigger alert if breached twice consecutively
      if (breachedCities[city] >= 2) {
        console.log(`ALERT: ${city} has exceeded ${temperatureThreshold}°C for two consecutive updates.`);
        breachedCities[city] = 0; // Reset count after alert
      }
    } else {
      breachedCities[city] = 0; // Reset count if no breach
    }
  });
}


module.exports = checkWeatherThresholds;
