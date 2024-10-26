import { useEffect, useState } from 'react';
import { fetchWeather } from '../api';

function Weather() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Delhi'); // Default selected city

  useEffect(() => {
    const getWeather = async () => {
      try {
        const data = await fetchWeather();
        console.log(data)
        const uniqueData = removeDuplicates(data);
        setWeatherData(uniqueData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    getWeather();
    
  }, [selectedCity]);


  const removeDuplicates = (data) => {
    const unique = new Map(); // Use Map to ensure unique entries by timestamp
    data.forEach((item) => unique.set(item.timestamp, item));
    return Array.from(unique.values()); // Convert back to array
  };


  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp); // Use the ISO string directly
    return date.toLocaleTimeString(); // Format date and time
  };

  const handleCityChange = (city) => {
    setSelectedCity(city); // Set the selected city
  };

  if (loading) return <div className="flex justify-center mt-6"><span className="loading loading-dots  w-28"></span></div>
  if (!weatherData.length) return <div className='text-center text-3xl font-bold'>No weather data available.</div>;

  // Filter weather data based on the selected city
  const filteredWeatherData = weatherData.filter((item) => item.city === selectedCity);

  const getWeatherIcon = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div>
      <h2 className='text-2xl text-red-600 text-center mb-4 mt-2 font-extrabold'>Current Weather</h2>

      {/* City Selection Tabs */}
      <div className="tabs">
        {['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'].map((city) => (
          <button
            key={city}
            className={`tab ${selectedCity === city ? 'tab-active' : ''} border-b border-r-stone-800 mb-3 text-lg font-extrabold ` }
            onClick={() => handleCityChange(city)}
          >
            {city}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center mt-3">
        {filteredWeatherData.map((item, index) => (
          <div key={index} className="card  bg-base-100 w-96 mb-5 mr-4 shadow-xl">
            <figure className="px-10 pt-10">
            <img
                src={getWeatherIcon(item.icon)} // Dynamic icon based on weather data
                alt={item.main}
                className="rounded-xl"
              />
            </figure>
            <div className="card-body items-center text-center font-bold">
              <h2 className="card-title font-extrabold text-cyan-400">{item.city}</h2>
              <p className='text-pink-500 font-bold'>Temp: {item.temp}°C </p>
              <p className='text-red-500 font-bold'>Feels Like: {item.main}</p>
              <p className='text-green-500 font-bold'>Last Updated: {formatTimestamp(item.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Weather;
