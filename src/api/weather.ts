import type { City } from "../types/City.ts";
import type { TemperatureUnit } from "../types/Config.ts";
import type { DailyForecast, ForecastResponse } from "../types/Weather.ts";

export async function getCurrentTemperature(city: City, unit: TemperatureUnit): Promise<number> {
  const temperatureUnit = unit === "F" ? "fahrenheit" : "celsius";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m&temperature_unit=${temperatureUnit}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`OpenMeteo API: HTTP ${res.status}`);
  }
  const data = (await res.json()) as ForecastResponse;
  const temperature = data.current?.temperature_2m;
  if (temperature === undefined) {
    throw new Error("Sin datos de temperatura actual");
  }
  return temperature;
}

export async function getDailyForecast(city: City, unit: TemperatureUnit): Promise<DailyForecast[]> {
  const temperatureUnit = unit === "F" ? "fahrenheit" : "celsius";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=7&timezone=auto&temperature_unit=${temperatureUnit}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`OpenMeteo API: HTTP ${res.status}`);
  }
  const data = (await res.json()) as ForecastResponse;
  const daily = data.daily;
  if (!daily || daily.time.length === 0) {
    throw new Error("Sin datos de pronóstico diario");
  }
  return daily.time.map((date, i) => ({
    date,
    tempMax: daily.temperature_2m_max[i]!,
    tempMin: daily.temperature_2m_min[i]!,
    weatherCode: daily.weather_code[i]!,
  }));
}
