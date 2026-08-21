import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { City } from "../types/City.ts";
import type { Config } from "../types/Config.ts";

const CONFIG_FILE = "data.json";

function readConfig(): Config {
  if (!existsSync(CONFIG_FILE)) {
    return { defaultCity: null, cities: [], unit: "C" };
  }
  const parsed = JSON.parse(readFileSync(CONFIG_FILE, "utf-8")) as Partial<Config>;
  return {
    defaultCity: parsed.defaultCity ?? null,
    cities: parsed.cities ?? [],
    unit: parsed.unit ?? "C",
  };
}

function writeConfig(config: Config): void {
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n");
}

export function loadCities(): City[] {
  return readConfig().cities;
}

export function saveCities(cities: City[]): void {
  const config = readConfig();
  config.cities = cities;
  writeConfig(config);
}
