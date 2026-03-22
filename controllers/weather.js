import axios from 'axios';
import LocationModel from '../models/location.js';

// Weather controller for fetching weather data
export const getWeather = async (req, res) => {
  const { city } = req.params;
  const url = `https://wttr.in/${city}?format=j1`;

  try {
    // Check if data is cached in DB (optional, for optimization)
    const cached = await LocationModel.findOne({ city });
    if (cached && (Date.now() - cached.lastUpdated) < 600000) { // 10 minutes cache
      return res.status(200).json(cached.weatherData);
    }

    // Fetch from API
    const response = await axios.get(url);
    const weatherData = response.data;

    // Cache in DB
    await LocationModel.findOneAndUpdate(
      { city },
      { weatherData, lastUpdated: new Date() },
      { upsert: true }
    );

    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weather data', error: error.message });
  }
};