import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { getCurrentTemperature, getDailyForecast } from "../../src/api/weather.ts";
import type { City } from "../../src/types/City.ts";
import type { DailyForecast } from "../../src/types/Weather.ts";
import { mockFetch } from "./helpers.ts";

const roma: City = {
  name: "Roma",
  country: "Italia",
  latitude: 41.89193,
  longitude: 12.51133,
};

let fetchState: ReturnType<typeof mockFetch>;

beforeEach(() => {
  fetchState = mockFetch();
});

afterEach(() => {
  fetchState.restore();
});

describe("getCurrentTemperature", () => {
  it("obtiene la temperatura en Celsius", async () => {
    fetchState.queue.push({ body: { current: { temperature_2m: 21.5 } } });

    const temperature = await getCurrentTemperature(roma, "C");
    expect(fetchState.calls[0]!.url).toBe(
      "https://api.open-meteo.com/v1/forecast?latitude=41.89193&longitude=12.51133&current=temperature_2m&temperature_unit=celsius",
    );
    expect(temperature).toBe(21.5);
  });

  it("obtiene la temperatura en Fahrenheit", async () => {
    fetchState.queue.push({ body: { current: { temperature_2m: 70.7 } } });

    await getCurrentTemperature(roma, "F");
    expect(fetchState.calls[0]!.url).toContain("temperature_unit=fahrenheit");
  });

  it("lanza un error cuando la respuesta no es OK", async () => {
    fetchState.queue.push({ status: 403, body: {} });

    expect(getCurrentTemperature(roma, "C")).rejects.toThrow("OpenMeteo API: HTTP 403");
  });

  it("lanza un error cuando no hay datos de temperatura", async () => {
    fetchState.queue.push({ body: {} });

    expect(getCurrentTemperature(roma, "C")).rejects.toThrow("Sin datos de temperatura actual");
  });
});

describe("getDailyForecast", () => {
  it("mapea el pronóstico diario", async () => {
    fetchState.queue.push({
      body: {
        daily: {
          time: ["2026-08-21", "2026-08-22"],
          temperature_2m_max: [20, 22],
          temperature_2m_min: [10, 11],
          weather_code: [0, 3],
        },
      },
    });

    const days = await getDailyForecast(roma, "C");
    expect(fetchState.calls[0]!.url).toContain("daily=temperature_2m_max,temperature_2m_min,weather_code");
    expect(fetchState.calls[0]!.url).toContain("forecast_days=7");
    expect(days).toEqual<DailyForecast[]>([
      { date: "2026-08-21", tempMax: 20, tempMin: 10, weatherCode: 0 },
      { date: "2026-08-22", tempMax: 22, tempMin: 11, weatherCode: 3 },
    ]);
  });

  it("usa el parámetro de temperatura según la unidad", async () => {
    fetchState.queue.push({
      body: {
        daily: {
          time: ["2026-08-21"],
          temperature_2m_max: [20],
          temperature_2m_min: [10],
          weather_code: [0],
        },
      },
    });

    await getDailyForecast(roma, "F");
    expect(fetchState.calls[0]!.url).toContain("temperature_unit=fahrenheit");
  });

  it("lanza un error cuando la respuesta no es OK", async () => {
    fetchState.queue.push({ status: 500, body: {} });

    expect(getDailyForecast(roma, "C")).rejects.toThrow("OpenMeteo API: HTTP 500");
  });

  it("lanza un error cuando no hay datos de pronóstico", async () => {
    fetchState.queue.push({ body: {} });

    expect(getDailyForecast(roma, "C")).rejects.toThrow("Sin datos de pronóstico diario");
  });
});
