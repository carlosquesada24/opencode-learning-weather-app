export type TemperatureUnit = "C" | "F";

export interface City {
  name: string;
  country: string;
  administrationLevel1?: string;
  latitude: number;
  longitude: number;
}

export interface Config {
  defaultCity: string | null;
  cities: City[];
  unit: TemperatureUnit;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}
