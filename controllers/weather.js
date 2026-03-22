import axios from 'axios';
import LocationModel from '../models/location.js';

// Weather controller for fetching weather data
export const getWeather = async (req, res) => {
  const { city } = req.params;
  const normalizedCity = city.trim().toLowerCase();
  const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;

  try {
    // Check if data is cached in DB (optional, for optimization)
    const cached = await LocationModel.findOne({ city: normalizedCity });
    if (cached && (Date.now() - cached.lastUpdated) < 600000) { // 10 minutes cache
      return res.status(200).json(cached.weatherData);
    }

    // Fetch from API
    const response = await axios.get(url);
    const weatherData = response.data;

    // Normalize location info from wttr.in response
    const locationName = weatherData?.nearest_area?.[0]?.areaName?.[0]?.value || city;
    const countryName = weatherData?.nearest_area?.[0]?.country?.[0]?.value || '';
    const normalizedLocationName = locationName.trim().toLowerCase();
    // Cache in DB using the location model format
    await LocationModel.findOneAndUpdate(
      { city: normalizedLocationName },
      {
        city: normalizedLocationName,
        country: countryName.trim(),
        weatherData,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weather data', error: error.message });
  }
};