import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { Config, TemperatureUnit } from "../types/Config.ts";

export interface Settings {
  defaultCity: string | null;
  unit: TemperatureUnit;
}

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

export function loadSettings(): Settings {
  const config = readConfig();
  return { defaultCity: config.defaultCity, unit: config.unit };
}

export function saveSettings(settings: Settings): void {
  const config = readConfig();
  config.defaultCity = settings.defaultCity;
  config.unit = settings.unit;
  writeConfig(config);
}
