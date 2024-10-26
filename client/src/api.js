// src/api.js

import axios from 'axios';

const API_URL = 'http://localhost:7789/weather'; // Update this URL if your backend is hosted elsewhere

export const fetchWeather = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

export const fetchSummaries = async () => {
  const response = await axios.get(`${API_URL}/summaries`);
  return response.data;
};
