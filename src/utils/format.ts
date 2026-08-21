import type { TemperatureUnit } from "../types/Config.ts";
import type { DailyForecast } from "../types/Weather.ts";

export const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
export const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export function formatTemperature(value: number, unit: TemperatureUnit): string {
  return `${value.toFixed(1)} °${unit}`;
}

export function weatherCodeLabel(code: number): string {
  if (code === 0) return "Despejado";
  if (code === 1 || code === 2) return "Parcialmente nublado";
  if (code === 3) return "Nublado";
  if (code === 45 || code === 48) return "Niebla";
  if (code === 51 || code === 53 || code === 55) return "Llovizna";
  if (code === 56 || code === 57) return "Llovizna helada";
  if (code === 61 || code === 63 || code === 65) return "Lluvia";
  if (code === 66 || code === 67) return "Lluvia helada";
  if (code === 71 || code === 73 || code === 75) return "Nieve";
  if (code === 77) return "Cina de nieve";
  if (code === 80 || code === 81 || code === 82) return "Chubascos";
  if (code === 85 || code === 86) return "Chubascos de nieve";
  if (code === 95) return "Tormenta";
  if (code === 96 || code === 99) return "Tormenta con granizo";
  return "—";
}

export function formatForecastDay(day: DailyForecast, unit: TemperatureUnit): string {
  const [year, month, dayOfMonth] = day.date.split("-").map(Number);
  const monthIndex = (month ?? 1) - 1;
  const weekdayIndex = new Date(year!, monthIndex, dayOfMonth).getDay();
  const dateLabel = `${WEEKDAYS[weekdayIndex]} ${dayOfMonth} de ${MONTHS[monthIndex]}, ${year}`;
  return `${dateLabel} — ${formatTemperature(day.tempMin, unit)} / ${formatTemperature(day.tempMax, unit)} — ${weatherCodeLabel(day.weatherCode)}`;
}
