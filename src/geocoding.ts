import type { City } from "./types.ts";

interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

export async function geocode(cityName: string): Promise<City | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=es&format=json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Geocoding API: HTTP ${res.status}`);
  }
  const data = (await res.json()) as GeocodingResponse;
  const first = data.results?.[0];
  if (!first) {
    return null;
  }
  return {
    name: first.name,
    country: first.country,
    latitude: first.latitude,
    longitude: first.longitude,
  };
}
