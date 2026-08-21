import type { City } from "../types/City.ts";
import type { TemperatureUnit } from "../types/Config.ts";
import type { DailyForecast } from "../types/Weather.ts";
import { formatForecastDay, formatTemperature } from "../utils/format.ts";
import { green, red, yellow } from "../utils/colors.ts";

export function message(text: string): void {
  console.log(text);
}

export function success(text: string): void {
  console.log(green(text));
}

export function error(text: string): void {
  console.log(red(text));
}

export function highlight(text: string): void {
  console.log(yellow(text));
}

export function cityLabel(city: City): string {
  const region = city.administrationLevel1 ? `${city.administrationLevel1}, ` : "";
  return `${city.name} — ${region}${city.country}`;
}

export function cityList(cities: City[]): void {
  cities.forEach((city, i) => console.log(`  ${i + 1}. ${cityLabel(city)}`));
}

export function weatherCity(city: City, temperature: number, unit: TemperatureUnit): void {
  console.log(`  ${cityLabel(city)}: ${yellow(formatTemperature(temperature, unit))}`);
}

export function forecastTitle(city: City): void {
  console.log(`  ${yellow(`Pronóstico 7 días — ${cityLabel(city)}`)}`);
}

export function forecastDay(day: DailyForecast, unit: TemperatureUnit): void {
  console.log(`  ${yellow(formatForecastDay(day, unit))}`);
}
