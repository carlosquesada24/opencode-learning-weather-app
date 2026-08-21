import type { City, TemperatureUnit } from "./types.ts";

interface CurrentWeather {
  temperature_2m: number;
}

interface ForecastResponse {
  current?: CurrentWeather;
}

export function formatTemperature(value: number, unit: TemperatureUnit): string {
  return `${value.toFixed(1)} °${unit}`;
}

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
