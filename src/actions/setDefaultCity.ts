import { cityList, error, message, success } from "../presentation/output.ts";
import { askIndex } from "../presentation/input.ts";
import type { Config } from "../types/Config.ts";

export async function setDefaultCity(config: Config): Promise<Config> {
  if (config.cities.length === 0) {
    message("  No hay ciudades registradas.");
    return config;
  }
  cityList(config.cities);
  const index = await askIndex("  Número a establecer como default: ", config.cities.length);
  if (index === null) {
    error("  Opción inválida.");
    return config;
  }
  config.defaultCity = config.cities[index]!.name;
  success(`  Ciudad default: ${config.defaultCity}.`);
  return config;
}
