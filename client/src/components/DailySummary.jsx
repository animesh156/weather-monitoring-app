// src/components/DailySummary.jsx

import { useEffect, useState } from "react";
import { fetchSummaries } from "../api"; // Import the fetchSummaries function

const DailySummary = () => {
  const [summaries, setSummaries] = useState([]); // Initialize as an array
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("Delhi"); // Default city

  const cities = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"];

  // Fetch summaries based on the selected  city
  useEffect(() => {
    const getSummaries = async () => {
      setLoading(true); // Set loading state to true before fetching
      try {
        const data = await fetchSummaries(selectedCity); // Fetch data for the selected city
        setSummaries(data); // Store fetched data in state
      } catch (error) {
        console.error("Error fetching summaries:", error);
        setSummaries([]); // Handle error by resetting to an empty array
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    getSummaries();
  }, [selectedCity]); // Run effect only when selectedCity changes

  // Function to handle tab clicks
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value); // Update selected city
  };

  const isToday = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };


  if (loading)
    return (
      <div className="flex justify-center mt-6">
        <span className="loading loading-dots w-28"></span>
      </div>
    );

  if (summaries.length === 0)
    return <div className="text-3xl text-center font-bold mt-10">No summaries available for {selectedCity}.</div>;

  const filteredSummaryData = summaries.filter(
    (item) => item.city === selectedCity && isToday(item.date)
  );

  return (
    <div>
      <h2 className="text-2xl text-rose-500 text-center font-bold mb-5">
        Daily Summaries
      </h2>
     
      <div className="flex justify-center mb-6">
        <select
          className="select select-secondary w-full max-w-xs"
          value={selectedCity} // Controlled component
          onChange={handleCityChange} // Update selected city on change
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>


      


      <div className="flex flex-wrap justify-center">
        {filteredSummaryData.map((summary) => (
          <div
            key={summary._id}
            className="card bg-base-100 border-2 border-cyan-400 dark:bg-black mb-6  w-80 shadow-xl"
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
