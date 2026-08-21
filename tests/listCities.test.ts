import { beforeEach, afterEach, describe, expect, it } from "bun:test";
import { listCities } from "../src/actions/listCities.ts";
import type { Config } from "../src/types/Config.ts";
import { captureLogs, type LogCapture } from "./helpers.ts";

let cap: LogCapture;

beforeEach(() => {
  cap = captureLogs();
});

afterEach(() => {
  cap.restore();
});

describe("listCities", () => {
  it("avisa cuando no hay ciudades", () => {
    const config: Config = { defaultCity: null, cities: [], unit: "C" };
    listCities(config);
    expect(cap.lines).toEqual(["  No hay ciudades registradas."]);
  });

  it("lista las ciudades registradas", () => {
    const config: Config = {
      defaultCity: null,
      cities: [
        { name: "Roma", country: "Italia", latitude: 41.89193, longitude: 12.51133 },
        { name: "Beijing", country: "China", latitude: 25.07655, longitude: 114.26569 },
      ],
      unit: "C",
    };
    listCities(config);
    expect(cap.lines).toEqual([
      "  1. Roma — Italia",
      "  2. Beijing — China",
    ]);
  });
});
