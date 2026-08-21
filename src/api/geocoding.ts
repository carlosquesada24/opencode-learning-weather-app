import type { City } from "../types/City.ts";

interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

export async function geocode(cityName: string, count = 10): Promise<City[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=${count}&language=es&format=json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Geocoding API: HTTP ${res.status}`);
  }
  const data = (await res.json()) as GeocodingResponse;
  return (data.results ?? []).map((result) => ({
    name: result.name,
    country: result.country,
    administrationLevel1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}
