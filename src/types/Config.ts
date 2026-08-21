import type { City } from "./City.ts";

export type TemperatureUnit = "C" | "F";

export interface Config {
  defaultCity: string | null;
  cities: City[];
  unit: TemperatureUnit;
}
