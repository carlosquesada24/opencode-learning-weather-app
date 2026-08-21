import { cityList, message } from "../presentation/output.ts";
import type { Config } from "../types/Config.ts";

export function listCities(config: Config): void {
  if (config.cities.length === 0) {
    message("  No hay ciudades registradas.");
    return;
  }
  cityList(config.cities);
}
