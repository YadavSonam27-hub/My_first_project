import SearchHistory from '../models/SearchHistory.js';
import User from '../models/User.js';
import { getCurrentWeatherAndForecast } from '../services/weatherService.js';

export const getWeather = async (req, res) => {
  try {
    const city = req.query.city;
    const data = await getCurrentWeatherAndForecast(city);

    await SearchHistory.create({
      user: req.user.id,
      city,
      summary: `${data.current.temperature}°C, ${data.current.condition}`
    });
    await User.findByIdAndUpdate(req.user.id, { lastSearchedCity: city });

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch weather', error: error.response?.data || error.message });
  }
};

export const askAgent = async (req, res) => {
  try {
    const { query } = req.query;
    const user = await User.findById(req.user.id);
    const city = user?.lastSearchedCity;

    if (!city) {
      return res.status(400).json({ message: 'No previous city found. Please search for a city first.' });
    }

    const data = await getCurrentWeatherAndForecast(city);
    const answer = query?.toLowerCase().includes('tomorrow')
      ? `Tomorrow in ${city}, expect around ${data.forecast[0]?.temp ?? 'N/A'}°C with ${data.forecast[0]?.condition ?? 'unknown'}.`
      : `Latest weather in ${city}: ${data.current.temperature}°C, ${data.current.condition}.`;

    return res.json({ city, query, answer, recommendations: data.recommendations });
  } catch (error) {
    return res.status(500).json({ message: 'Agent failed', error: error.message });
  }
};

export const getHistory = async (req, res) => {
  const history = await SearchHistory.find({ user: req.user.id }).sort({ searchedAt: -1 }).limit(10);
  res.json(history);
};
