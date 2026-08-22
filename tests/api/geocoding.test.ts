import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { geocode } from "../../src/api/geocoding.ts";
import { mockFetch } from "./helpers.ts";

let fetchState: ReturnType<typeof mockFetch>;

beforeEach(() => {
  fetchState = mockFetch();
});

afterEach(() => {
  fetchState.restore();
});

describe("geocode", () => {
  it("construye la URL correcta y mapea los resultados", async () => {
    fetchState.queue.push({
      body: {
        results: [
          {
            name: "San José",
            latitude: 9.92807,
            longitude: -84.09072,
            country: "Costa Rica",
            admin1: "San José",
          },
        ],
      },
    });

    const cities = await geocode("San José");
    expect(fetchState.calls[0]!.url).toContain("https://geocoding-api.open-meteo.com/v1/search");
    expect(fetchState.calls[0]!.url).toContain("name=San%20Jos%C3%A9");
    expect(fetchState.calls[0]!.url).toContain("count=10");
    expect(fetchState.calls[0]!.url).toContain("language=es");
    expect(cities).toEqual([
      {
        name: "San José",
        latitude: 9.92807,
        longitude: -84.09072,
        country: "Costa Rica",
        administrationLevel1: "San José",
      },
    ]);
  });

  it("respeta el parámetro count", async () => {
    fetchState.queue.push({ body: { results: [] } });

    await geocode("Madrid", 5);
    expect(fetchState.calls[0]!.url).toContain("count=5");
  });

  it("devuelve una lista vacía cuando no hay resultados", async () => {
    fetchState.queue.push({ body: {} });

    const cities = await geocode("Ciudad Inexistente");
    expect(cities).toEqual([]);
  });

  it("lanza un error cuando la respuesta no es OK", async () => {
    fetchState.queue.push({ status: 404, body: {} });

    expect(geocode("Roma")).rejects.toThrow("Geocoding API: HTTP 404");
  });
});
