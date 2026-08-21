import { getCurrentTemperature } from "../api/weather.ts";
import { error, message, weatherCity } from "../presentation/output.ts";
import type { City } from "../types/City.ts";
import type { Config } from "../types/Config.ts";

export async function showCityWeather(city: City, config: Config): Promise<void> {
  const temperature = await getCurrentTemperature(city, config.unit);
  weatherCity(city, temperature, config.unit);
}

export async function getWeatherDefault(config: Config): Promise<void> {
  if (!config.defaultCity) {
    error("  No hay una ciudad default definida.");
    return;
  }
  const city = config.cities.find((c) => c.name === config.defaultCity);
  if (!city) {
    error("  La ciudad default no está registrada.");
    return;
  }
  await showCityWeather(city, config);
}

export async function getWeatherAll(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    message("  No hay ciudades registradas.");
    return;
  }
  for (const city of config.cities) {
    await showCityWeather(city, config);
  }
}
