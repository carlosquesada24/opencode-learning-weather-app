export type TemperatureUnit = "C" | "F";

export interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Config {
  defaultCity: string | null;
  cities: City[];
  unit: TemperatureUnit;
}
