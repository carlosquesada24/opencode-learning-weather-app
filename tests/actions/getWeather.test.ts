import { beforeEach, afterEach, describe, expect, it } from "bun:test";
import { showCityWeather, getWeatherDefault, getWeatherAll } from "../../src/actions/getWeather.ts";
import type { City } from "../../src/types/City.ts";
import type { Config } from "../../src/types/Config.ts";
import { captureLogs, mockFetch, type LogCapture } from "./helpers.ts";

const roma: City = {
  name: "Roma",
  country: "Italia",
  latitude: 41.89193,
  longitude: 12.51133,
};

const beijing: City = {
  name: "Beijing",
  country: "China",
  latitude: 25.07655,
  longitude: 114.26569,
};

let cap: LogCapture;
let fetchState: ReturnType<typeof mockFetch>;

beforeEach(() => {
  cap = captureLogs();
  fetchState = mockFetch();
});

afterEach(() => {
  cap.restore();
  fetchState.restore();
});

describe("showCityWeather", () => {
  it("muestra la temperatura de una ciudad", async () => {
    fetchState.queue.push({ body: { current: { temperature_2m: 21.5 } } });
    const config: Config = { defaultCity: null, cities: [], unit: "C" };
    await showCityWeather(beijing, config);
    expect(fetchState.calls).toHaveLength(1);
    expect(cap.lines).toEqual(["  Beijing — China: \x1b[33m21.5 °C\x1b[0m"]);
  });
});

describe("getWeatherDefault", () => {
  it("avisa cuando no hay ciudad default", async () => {
    const config: Config = { defaultCity: null, cities: [], unit: "C" };
    await getWeatherDefault(config);
    expect(fetchState.calls).toHaveLength(0);
    expect(cap.lines).toEqual(["\x1b[31m  No hay una ciudad default definida.\x1b[0m"]);
  });

  it("avisa cuando el default no está registrado", async () => {
    const config: Config = { defaultCity: "Madrid", cities: [roma], unit: "C" };
    await getWeatherDefault(config);
    expect(fetchState.calls).toHaveLength(0);
    expect(cap.lines).toEqual(["\x1b[31m  La ciudad default no está registrada.\x1b[0m"]);
  });

  it("muestra el clima de la ciudad default", async () => {
    fetchState.queue.push({ body: { current: { temperature_2m: 30 } } });
    const config: Config = { defaultCity: "Roma", cities: [roma], unit: "C" };
    await getWeatherDefault(config);
    expect(cap.lines).toEqual(["  Roma — Italia: \x1b[33m30.0 °C\x1b[0m"]);
  });
});

describe("getWeatherAll", () => {
  it("avisa cuando no hay ciudades", async () => {
    const config: Config = { defaultCity: null, cities: [], unit: "C" };
    await getWeatherAll(config);
    expect(fetchState.calls).toHaveLength(0);
    expect(cap.lines).toEqual(["  No hay ciudades registradas."]);
  });

  it("muestra el clima de todas las ciudades", async () => {
    fetchState.queue.push(
      { body: { current: { temperature_2m: 25 } } },
      { body: { current: { temperature_2m: 25 } } },
    );
    const config: Config = { defaultCity: null, cities: [roma, beijing], unit: "F" };
    await getWeatherAll(config);
    expect(cap.lines).toEqual([
      "  Roma — Italia: \x1b[33m25.0 °F\x1b[0m",
      "  Beijing — China: \x1b[33m25.0 °F\x1b[0m",
    ]);
  });
});
