import  { useEffect, useState } from 'react';
import {fetchWeather} from '../api'


function Weather() {
    
    const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);


    useEffect(() => {
    const getWeather = async () => {
        try {
          const data = await fetchWeather();
          setWeatherData(data);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      getWeather();
      const interval = setInterval(getWeather, 300000); // Refresh every 5 minutes
      return () => clearInterval(interval); // Cleanup on unmount
    }, []);
  
    if (loading) return <div>Loading...</div>;
    if (!weatherData) return <div>No weather data available.</div>;

  return (
    <div>
    <h2>Current Weather</h2>
    <ul>
      {weatherData.map((item) => (
        <li key={item.city}>
          {item.city}: {item.temp}°C - {item.main}
        </li>
      ))}
    </ul>
  </div>
  )
}

export default Weather

