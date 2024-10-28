import { useEffect, useState } from "react";
import { fetchSummaries } from "../api"; // Import the fetchSummaries function

const DailySummary = () => {
  const [summaries, setSummaries] = useState([]); // Initialize as an array
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("Delhi"); // Default city

  // Initialize selectedDate with the current date in YYYY-MM-DD format
  const getCurrentDate = () => new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(getCurrentDate()); // Default to today's date

  const cities = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"];

  useEffect(() => {
    const getSummaries = async () => {
      setLoading(true);
      try {
        const data = await fetchSummaries();
        setSummaries(data);
      } catch (error) {
        console.error("Error fetching summaries:", error);
        setSummaries([]);
      } finally {
        setLoading(false);
      }
    };

    getSummaries();
  }, [selectedCity]); // Run when selectedCity changes

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Filter summaries by selected city and date
  const filteredSummaryData = summaries.filter((item) => {
    const itemDate = new Date(item.date).toISOString().split("T")[0];
    return item.city === selectedCity && itemDate === selectedDate;
  });

  if (loading)
    return (
      <div className="flex justify-center mt-6">
        <span className="loading loading-dots text-rose-600 w-28"></span>
      </div>
    );

  return (
    <div>
      {/* City Selection */}
      <div className="flex justify-center mb-2 mt-4">
        <select
          className="select select-secondary w-full max-w-xs dark:text-green-500"
          value={selectedCity}
          onChange={handleCityChange}
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Date Input */}
      <div className="flex justify-center mb-8">
        <input
          type="date"
          className="input input-bordered border-rose-500 w-full max-w-xs"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      {/* No Data Message */}
      {!filteredSummaryData.length && (
        <div className="text-center text-3xl font-bold mt-10">
          No weather data available for {selectedCity} on {selectedDate}.
        </div>
      )}

      {/* Summaries Display */}
      <div className="flex flex-wrap justify-center ">
        {filteredSummaryData.map((summary) => (
          <div
            key={summary._id}
            className="card bg-base-100 h-96 border-2 border-cyan-400 dark:bg-black mb-4 w-80 shadow-xl"
          >
            <figure className="px-10 pt-6">
              <img
                src={`https://openweathermap.org/img/wn/${summary.icon}@2x.png`}
                alt={summary.dominantCondition}
                className="rounded-xl"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h1 className="card-title text-3xl font-extrabold -mt-4 text-sky-500">
                {summary.city}
              </h1>
              <p className="font-bold text-yellow-400">Date: {summary.date}</p>
              <p className="font-bold text-pink-500">Avg Temp: {summary.avgTemp}°C</p>
              <p className="font-bold text-violet-600">Max Temp: {summary.maxTemp}°C</p>
              <p className="font-bold text-orange-500">Min Temp: {summary.minTemp}°C</p>
              <p className="font-bold text-red-500">Avg Wind: {summary.avgWindSpeed}</p>
              <p className="font-bold text-cyan-400">Avg Humidity: {summary.avgHumidity}</p>
              <p className="font-bold text-fuchsia-700">
                Dominant Condition: {summary.dominantCondition}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailySummary;
