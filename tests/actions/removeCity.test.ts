import { beforeEach, afterEach, describe, expect, it, mock } from "bun:test";
import type { City } from "../../src/types/City.ts";
import type { Config } from "../../src/types/Config.ts";
import { captureLogs, type LogCapture } from "./helpers.ts";

const askIndexMock = mock(async () => 0 as number | null);
mock.module("../src/presentation/input.ts", () => ({
  askIndex: askIndexMock,
}));

import { removeCity } from "../../src/actions/removeCity.ts";

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

beforeEach(() => {
  cap = captureLogs();
  askIndexMock.mockReset();
});

afterEach(() => {
  cap.restore();
});

describe("removeCity", () => {
  it("avisa cuando no hay ciudades", async () => {
    const config: Config = { defaultCity: null, cities: [], unit: "C" };
    const result = await removeCity(config);
    expect(result).toBe(config);
    expect(cap.lines).toEqual(["  No hay ciudades registradas."]);
  });

  it("avisa cuando la opción es inválida", async () => {
    askIndexMock.mockResolvedValue(null);
    const config: Config = { defaultCity: "Roma", cities: [roma], unit: "C" };
    const result = await removeCity(config);
    expect(result.cities).toEqual([roma]);
    expect(cap.lines).toEqual([
      "  1. Roma — Italia",
      "\x1b[31m  Opción inválida.\x1b[0m",
    ]);
  });

  it("elimina una ciudad que no es la default", async () => {
    askIndexMock.mockResolvedValue(0);
    const config: Config = { defaultCity: "Beijing", cities: [roma, beijing], unit: "C" };
    const result = await removeCity(config);
    expect(result.cities).toEqual([beijing]);
    expect(result.defaultCity).toBe("Beijing");
    expect(cap.lines).toEqual([
      "  1. Roma — Italia",
      "  2. Beijing — China",
      "\x1b[32m  Se eliminó Roma.\x1b[0m",
    ]);
  });

  it("elimina la ciudad default y limpia el valor", async () => {
    askIndexMock.mockResolvedValue(1);
    const config: Config = { defaultCity: "Beijing", cities: [roma, beijing], unit: "C" };
    const result = await removeCity(config);
    expect(result.cities).toEqual([roma]);
    expect(result.defaultCity).toBeNull();
    expect(cap.lines).toEqual([
      "  1. Roma — Italia",
      "  2. Beijing — China",
      "\x1b[32m  Se eliminó Beijing.\x1b[0m",
    ]);
  });
});
