import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

import './App.css'

function App() {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const response = await axios.get('http://localhost:5000/weather/update');
      setWeatherData([response.data.summary]);
    };
    fetchWeatherData();
  }, []);

  const data = {
    labels: weatherData.map((_, index) => `Update ${index + 1}`),
    datasets: [
      {
        label: 'Average Temperature (°C)',
        data: weatherData.map(item => item.avgTemp),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  return (
    <>
       <h1>Weather Dashboard</h1>
       <Line data={data} />
    </>
  )
}

export default App
