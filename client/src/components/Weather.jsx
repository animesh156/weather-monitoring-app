import { useEffect, useState } from 'react';
import { fetchWeather } from '../api';

function Weather() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Delhi'); // Default city
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date

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
  }, [selectedCity, selectedDate]);

  const removeDuplicates = (data) => {
    const unique = new Map();
    data.forEach((item) => unique.set(item.timestamp, item));
    return Array.from(unique.values());
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toDateString();
  };

  const handleCityChange = (e) => setSelectedCity(e.target.value);
  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const filterWeatherByDate = (data) =>
    data.filter(
      (item) =>
        item.city === selectedCity &&
        new Date(item.timestamp).toISOString().split('T')[0] === selectedDate
    );

  if (loading) return <div className="flex justify-center mt-6"><span className="loading loading-dots text-sky-600 w-28"></span></div>;
  if (!weatherData.length) return <div className="text-center text-3xl font-bold">No weather data available.</div>;

  const filteredWeatherData = filterWeatherByDate(weatherData);

  const getWeatherIcon = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div>
      <h2 className="text-2xl text-red-600 text-center mb-4 mt-2 font-extrabold">Current Weather</h2>

      {/* City Selection */}
      <div className="flex justify-center mb-4">
        <select
          className="select select-secondary w-full max-w-xs dark:text-sky-400"
          value={selectedCity}
          onChange={handleCityChange}
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

      {/* Date Picker */}
      <div className="flex justify-center mb-6">
        <input
          type="date"
          className="input input-bordered border-rose-400 dark:text-yellow-300 w-full max-w-xs"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      <div className="flex flex-wrap justify-center mt-3">
        {filteredWeatherData.length ? (
          filteredWeatherData.map((item, index) => (
            <div
              key={index}
              className="card border-cyan-400 border-2 m-auto dark:bg-black bg-base-100 w-80 mb-5 shadow-xl"
            >
              <figure className="px-10 pt-10">
                <img
                  src={getWeatherIcon(item.icon)}
                  alt={item.main}
                  className="rounded-xl"
                />
              </figure>
              <div className="card-body items-center text-center font-bold">
                <h2 className="card-title font-extrabold text-cyan-400">{item.city}</h2>
                <p className="text-pink-500 font-bold">Temp: {item.temp}°C</p>
                <p className="text-red-500 font-bold">Condition: {item.main}</p>
                <p className="text-yellow-500 font-bold">Date: {formatDate(item.timestamp)}</p>
                <p className="text-green-500 font-bold">Last Updated: {formatTimestamp(item.timestamp)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-2xl font-bold">No weather data for the selected date.</div>
        )}
      </div>
    </div>
  );
}

export default Weather;
