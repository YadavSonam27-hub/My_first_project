import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const recommendationRules = (weather) => {
  const suggestions = [];
  const condition = weather?.weather?.[0]?.main?.toLowerCase() || '';
  const temp = weather?.main?.temp;

  if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm')) {
    suggestions.push('Carry an umbrella ☔');
  }
  if (typeof temp === 'number' && temp > 30) {
    suggestions.push('Stay hydrated and avoid direct sun during peak hours 🧴');
  }
  if (typeof temp === 'number' && temp < 10) {
    suggestions.push('Wear warm layers 🧥');
  }
  if (condition.includes('clear')) {
    suggestions.push('Great weather for outdoor activities 🌤️');
  }

  if (!suggestions.length) {
    suggestions.push('Weather looks moderate today. Have a great day!');
  }

  return suggestions;
};

export const getCurrentWeatherAndForecast = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const weatherResp = await axios.get(`${BASE_URL}/weather`, {
    params: { q: city, appid: apiKey, units: 'metric' }
  });

  const forecastResp = await axios.get(`${BASE_URL}/forecast`, {
    params: { q: city, appid: apiKey, units: 'metric' }
  });

  const current = weatherResp.data;
  const forecast = forecastResp.data.list
    .filter((item) => item.dt_txt.includes('12:00:00'))
    .slice(0, 5)
    .map((item) => ({
      date: item.dt_txt.split(' ')[0],
      temp: item.main.temp,
      condition: item.weather[0].description,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed
    }));

  return {
    city: current.name,
    country: current.sys.country,
    current: {
      temperature: current.main.temp,
      condition: current.weather[0].description,
      humidity: current.main.humidity,
      windSpeed: current.wind.speed
    },
    forecast,
    recommendations: recommendationRules(current)
  };
};
