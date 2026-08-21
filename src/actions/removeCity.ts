import { cityList, error, message, success } from "../presentation/output.ts";
import { askIndex } from "../presentation/input.ts";
import type { Config } from "../types/Config.ts";

export async function removeCity(config: Config): Promise<Config> {
  if (config.cities.length === 0) {
    message("  No hay ciudades registradas.");
    return config;
  }
  cityList(config.cities);
  const index = await askIndex("  Número a eliminar: ", config.cities.length);
  if (index === null) {
    error("  Opción inválida.");
    return config;
  }
  const removed = config.cities[index]!;
  config.cities.splice(index, 1);
  if (config.defaultCity === removed.name) {
    config.defaultCity = null;
  }
  success(`  Se eliminó ${removed.name}.`);
  return config;
}
