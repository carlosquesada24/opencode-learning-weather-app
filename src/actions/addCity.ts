import { geocode } from "../api/geocoding.ts";
import { cityLabel, cityList, error, message, success } from "../presentation/output.ts";
import { askIndex, prompt } from "../presentation/input.ts";
import type { City } from "../types/City.ts";
import type { Config } from "../types/Config.ts";

export async function addCity(config: Config): Promise<Config> {
  const name = (await prompt("  Nombre de la ciudad: ")).trim();
  if (!name) {
    error("  Operación cancelada.");
    return config;
  }
  const candidates = await geocode(name);
  if (candidates.length === 0) {
    error("  No se encontró la ciudad.");
    return config;
  }
  let city: City = candidates[0]!;
  if (candidates.length > 1) {
    cityList(candidates);
    const index = await askIndex("  Selecciona una opción: ", candidates.length);
    if (index === null) {
      error("  Opción inválida.");
      return config;
    }
    city = candidates[index]!;
  }
  if (config.cities.some((c) => c.name === city.name)) {
    message(`  ${city.name} ya está registrada.`);
    return config;
  }
  config.cities.push(city);
  success(`  Se agregó ${cityLabel(city)}.`);
  return config;
}
