// src/api.js

import axios from 'axios';

const API_URL = 'https://weather-monitoring-app-backend.vercel.app/weather'; 

export const fetchWeather = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

export const fetchSummaries = async () => {
  const response = await axios.get(`${API_URL}/summaries`);
  return response.data;
};
