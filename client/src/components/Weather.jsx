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

  const handleCityChange = (e) => {
    const city = e.target.value
    
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
      <div className="flex justify-center mb-6">
        <select
          className="select select-secondary w-full max-w-xs"
          value={selectedCity} // Controlled component
          onChange={handleCityChange} // Update city on change
        >
          <option disabled value="">
            Pick your city
          </option>
          {['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'].map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap justify-center mt-3">
        {filteredWeatherData.map((item, index) => (
          <div key={index} className="card border-cyan-400 border-2 m-auto dark:bg-black bg-base-100 w-80 mb-5  shadow-xl">
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
