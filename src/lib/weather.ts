export async function getWeather() {
  const apiKey = process.env.WEATHER_API_KEY;
  const month = new Date().getMonth() + 1; // 1-12
  let season = 'Summer';
  if (month >= 3 && month <= 5) season = 'Spring';
  else if (month >= 6 && month <= 8) season = 'Summer';
  else if (month >= 9 && month <= 11) season = 'Autumn';
  else season = 'Winter';

  if (!apiKey) return null;

  try {
    // Using WeatherAPI.com
    const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Hanoi&aqi=no`, { next: { revalidate: 3600 } });
    
    if (!res.ok) {
        console.warn("Weather API error:", res.statusText);
        return null;
    }
    
    const data = await res.json();
    return {
      temp: Math.round(data.current.temp_c),
      condition: data.current.condition.text,
      season: season,
      full: {
        location: data.location.name,
        humidity: data.current.humidity,
        wind: data.current.wind_kph
      }
    }
  } catch (e) {
    console.error("Failed to fetch weather", e);
    return null;
  }
}
