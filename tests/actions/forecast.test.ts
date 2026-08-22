import { beforeEach, afterEach, describe, expect, it, mock } from "bun:test";
import { forecast } from "../../src/actions/forecast.ts";
import type { City } from "../../src/types/City.ts";
import type { Config } from "../../src/types/Config.ts";
import { captureLogs, mockFetch, type LogCapture } from "./helpers.ts";

const askIndexMock = mock(async () => 0 as number | null);
mock.module("../src/presentation/input.ts", () => ({
  askIndex: askIndexMock,
}));

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
  askIndexMock.mockReset();
});

afterEach(() => {
  cap.restore();
  fetchState.restore();
});

describe("forecast", () => {
  it("avisa cuando no hay ciudades", async () => {
    const config: Config = { defaultCity: null, cities: [], unit: "C" };
    await forecast(config);
    expect(askIndexMock).not.toHaveBeenCalled();
    expect(cap.lines).toEqual(["  No hay ciudades registradas."]);
  });

  it("avisa cuando la opción es inválida", async () => {
    askIndexMock.mockResolvedValue(null);
    const config: Config = { defaultCity: null, cities: [roma], unit: "C" };
    await forecast(config);
    expect(cap.lines).toEqual([
      "  1. Roma — Italia",
      "\x1b[31m  Opción inválida.\x1b[0m",
    ]);
  });

  it("muestra el pronóstico de la ciudad seleccionada", async () => {
    askIndexMock.mockResolvedValue(0);
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
    const config: Config = { defaultCity: null, cities: [roma, beijing], unit: "C" };
    await forecast(config);
    expect(fetchState.calls).toHaveLength(1);
    expect(cap.lines).toEqual([
      "  1. Roma — Italia",
      "  2. Beijing — China",
      "  \x1b[33mPronóstico 7 días — Roma — Italia\x1b[0m",
      "  \x1b[33mviernes 21 de agosto, 2026 — 10.0 °C / 20.0 °C — Despejado\x1b[0m",
      "  \x1b[33msábado 22 de agosto, 2026 — 11.0 °C / 22.0 °C — Nublado\x1b[0m",
    ]);
  });
});
