// src/components/DailySummary.js

import  { useEffect, useState } from 'react';
import { fetchSummaries } from '../api';

const DailySummary = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSummaries = async () => {
      try {
        const data = await fetchSummaries();
        setSummaries(data);
      } catch (error) {
        console.error('Error fetching summaries:', error);
      } finally {
        setLoading(false);
      }
    };

    getSummaries();
  }, []);

  if (loading) return <div>Loading summaries...</div>;
  if (summaries.length === 0) return <div>No summaries available.</div>;

  return (
    <div>
      <h2>Daily Summaries</h2>
      <ul>
        {summaries.map((summary) => (
          <li key={summary._id}>
            {summary.city} on {summary.date}: Avg Temp: {summary.avgTemp}°C, Max Temp: {summary.maxTemp}°C, Min Temp: {summary.minTemp}°C, Dominant Condition: {summary.dominantCondition}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailySummary;
