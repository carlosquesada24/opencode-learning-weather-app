import { success } from "../presentation/output.ts";
import type { Config } from "../types/Config.ts";

export function toggleUnit(config: Config): Config {
  config.unit = config.unit === "C" ? "F" : "C";
  success(`  Unidad de temperatura: °${config.unit}.`);
  return config;
}
