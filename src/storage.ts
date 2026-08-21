import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { Config } from "./types.ts";

const CONFIG_FILE = "data.json";

const DEFAULT_CONFIG: Config = {
  defaultCity: null,
  cities: [],
  unit: "C",
};

export function loadConfig(): Config {
  if (!existsSync(CONFIG_FILE)) {
    return { ...DEFAULT_CONFIG };
  }
  const raw = readFileSync(CONFIG_FILE, "utf-8");
  const parsed = JSON.parse(raw) as Partial<Config>;
  return {
    defaultCity: parsed.defaultCity ?? DEFAULT_CONFIG.defaultCity,
    cities: parsed.cities ?? DEFAULT_CONFIG.cities,
    unit: parsed.unit ?? DEFAULT_CONFIG.unit,
  };
}

export function saveConfig(config: Config): void {
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n");
}
