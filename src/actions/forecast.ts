import { getDailyForecast } from "../api/weather.ts";
import { cityList, error, forecastDay, forecastTitle, message } from "../presentation/output.ts";
import { askIndex } from "../presentation/input.ts";
import type { Config } from "../types/Config.ts";

export async function forecast(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    message("  No hay ciudades registradas.");
    return;
  }
  cityList(config.cities);
  const index = await askIndex("  Número de la ciudad a consultar: ", config.cities.length);
  if (index === null) {
    error("  Opción inválida.");
    return;
  }
  const city = config.cities[index]!;
  forecastTitle(city);
  const days = await getDailyForecast(city, config.unit);
  for (const day of days) {
    forecastDay(day, config.unit);
  }
}
