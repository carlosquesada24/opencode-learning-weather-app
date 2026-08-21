export interface CurrentWeather {
  temperature_2m: number;
}

export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
}

export interface ForecastResponse {
  current?: CurrentWeather;
  daily?: DailyWeather;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}
