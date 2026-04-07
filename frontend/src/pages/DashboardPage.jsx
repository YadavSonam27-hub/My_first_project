import { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [agentQuery, setAgentQuery] = useState('What about tomorrow?');
  const [agentResponse, setAgentResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  const fetchHistory = async () => {
    try {
      const { data } = await client.get('/history');
      setHistory(data);
    } catch {
      setHistory([]);
    }
  };

  const searchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await client.get(`/weather?city=${encodeURIComponent(city)}`);
      setWeather(data);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  const askAgent = async () => {
    try {
      const { data } = await client.get(`/weather/agent?query=${encodeURIComponent(agentQuery)}`);
      setAgentResponse(data.answer);
    } catch (err) {
      setAgentResponse(err.response?.data?.message || 'Agent is unavailable');
    }
  };

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome {user?.name}! 👋</h1>
        <button onClick={() => setDarkMode((v) => !v)}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
      </div>

      <form className="search-row" onSubmit={searchWeather}>
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Search city..." required />
        <button type="submit">Search Weather</button>
      </form>

      {loading && <div className="center">Loading weather...</div>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <section>
          <div className="cards">
            <article className="card">
              <h3>{weather.city}</h3>
              <p>{weather.current.temperature}°C</p>
              <p>{weather.current.condition}</p>
              <p>Humidity: {weather.current.humidity}%</p>
              <p>Wind: {weather.current.windSpeed} m/s</p>
            </article>
            <article className="card">
              <h3>AI Suggestions</h3>
              <ul>
                {weather.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

          <h2>5-Day Forecast</h2>
          <div className="cards">
            {weather.forecast.map((d) => (
              <article key={d.date} className="card">
                <h4>{d.date}</h4>
                <p>{d.temp}°C</p>
                <p>{d.condition}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="agent-box">
        <h2>Ask Weather Agent</h2>
        <div className="search-row">
          <input value={agentQuery} onChange={(e) => setAgentQuery(e.target.value)} />
          <button onClick={askAgent}>Ask</button>
        </div>
        {agentResponse && <p>{agentResponse}</p>}
      </section>

      <section>
        <h2>Last Searched Cities</h2>
        <ul>
          {history.map((item) => (
            <li key={item._id}>
              {item.city} — {item.summary}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
