import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DailySummaryChart = () => {
  const [summaries, setSummaries] = useState([]);
  const [filteredSummaries, setFilteredSummaries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate()); // Default to today's date
  const [loading,setLoading] = useState(true)

  // Function to get the current date in YYYY-MM-DD format
  function getCurrentDate() {
    return new Date().toISOString().split("T")[0];
  }

  // Fetch summaries based on the selected date
  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const response = await axios.get(
          `https://weather-monitoring-app-backend.vercel.app/weather/summaries`
        );
        setLoading(false)
        setSummaries(response.data); // Set all summaries fetched from the backend
        filterData(response.data); // Immediately filter data after fetching
      } catch (error) {
        console.error("Error fetching summaries:", error);
        setLoading(false)
        setSummaries([]); // Reset summaries if an error occurs
      }
    };

    fetchSummaries(); // Fetch the summaries when the component mounts
  }, []); // Run only once when the component mounts

  // Filter summaries based on the selected date
  const filterData = (data) => {
    const filtered = data.filter((summary) => summary.date === selectedDate);
    setFilteredSummaries(filtered);
  };

  // Re-filter data whenever the selected date changes
  useEffect(() => {
    filterData(summaries); // Filter summaries based on the selected date
  }, [selectedDate]); // Re-filter when either selectedDate or summaries change

  // Prepare chart data from the filtered summaries
  const chartData = filteredSummaries.map((summary) => ({
    city: summary.city,
    avgTemp: summary.avgTemp,
    maxTemp: summary.maxTemp,
    minTemp: summary.minTemp,
    avgWindSpeed: summary.avgWindSpeed,
    avgHumidity: summary.avgHumidity,
  }));

  if(loading) return <div className="flex justify-center mt-6"><span className="loading loading-dots text-red-600 w-28"></span></div>;

  return (
    <div>
      {/* Heading */}
      <h2 className="text-2xl text-center text-cyan-400 mb-4 font-extrabold mt-3">
        Weather Summary on {new Date(selectedDate).toDateString()}
      </h2>

      {/* Date Input */}
      <div className="flex justify-center mb-6">
        <input
          type="date"
          className="input input-bordered w-full border-pink-500 max-w-xs"
          value={selectedDate}
          onChange={(e) => {
            const formattedDate = e.target.value; // Input date is already in YYYY-MM-DD format
            setSelectedDate(formattedDate);
          }}
        />
      </div>

      {/* Chart */}
     

      {/* No Data Message */}
      {!chartData.length ? (
        <div className="text-center text-2xl font-bold mt-5">
          No weather data available for {selectedDate}.
        </div>
      )   :  <ResponsiveContainer width="90%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="city" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="avgTemp" fill="#8884d8" name="Avg Temp" />
        <Bar dataKey="maxTemp" fill="#82ca9d" name="Max Temp" />
        <Bar dataKey="minTemp" fill="#ffc658" name="Min Temp" />
        <Bar dataKey="avgWindSpeed" fill="#ee82ee" name="Avg Wind" />
        <Bar dataKey="avgHumidity" fill="#ff0000" name="Avg Humidity" />
      </BarChart>
    </ResponsiveContainer>}
    </div>
  );
};

export default DailySummaryChart;
