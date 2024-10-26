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

  // Fetch daily summaries from the backend
  useEffect(() => {
    axios
      .get("https://weather-monitoring-app-backend.vercel.app/weather/daily-summaries")
      .then((response) => setSummaries(response.data))

      .catch((error) => console.error("Error fetching summaries:", error));
  }, []);

  const chartData = summaries.map((summary) => ({
    city: summary.city,
    avgTemp: summary.avgTemp,
    maxTemp: summary.maxTemp,
    minTemp: summary.minTemp,
    avgWindSpeed: summary.avgWindSpeed,
    avgHumidity: summary.avgHumidity,
  }));

  return (
    <div>
      <h2 className="text-2xl text-center text-cyan-400 mb-7 font-extrabold mt-3">Weather Summary by City</h2>
      <ResponsiveContainer width="90%" height={400}>
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
      </ResponsiveContainer>
    </div>
  );
};

export default DailySummaryChart;
