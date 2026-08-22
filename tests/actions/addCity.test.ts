import { beforeEach, afterEach, describe, expect, it, mock } from "bun:test";
import { addCity } from "../../src/actions/addCity.ts";
import type { City } from "../../src/types/City.ts";
import type { Config } from "../../src/types/Config.ts";
import { captureLogs, mockFetch, type LogCapture } from "../helpers.ts";

const promptMock = mock(async () => "Roma");
const askIndexMock = mock(async () => 0 as number | null);
mock.module("../../src/presentation/input.ts", () => ({
  prompt: promptMock,
  askIndex: askIndexMock,
}));

const roma: City = {
  name: "Roma",
  country: "Italia",
  administrationLevel1: "Región de Lacio",
  latitude: 41.89193,
  longitude: 12.51133,
};

const beijing: City = {
  name: "Beijing",
  country: "China",
  latitude: 25.07655,
  longitude: 114.26569,
};

function baseConfig(extra?: Partial<Config>): Config {
  return {
    defaultCity: null,
    cities: [],
    unit: "C",
    ...extra,
  };
}

function enqueueGeocodeResults(results: Record<string, unknown>[]) {
  fetchState.queue.push({ body: { results } });
}

let cap: LogCapture;
let fetchState: ReturnType<typeof mockFetch>;

beforeEach(() => {
  cap = captureLogs();
  fetchState = mockFetch();
  promptMock.mockReset();
  askIndexMock.mockReset();
});

afterEach(() => {
  cap.restore();
  fetchState.restore();
});

describe("addCity", () => {
  it("cancela con nombre vacío", async () => {
    promptMock.mockResolvedValue("   ");
    const config = baseConfig();
    const result = await addCity(config);
    expect(result).toBe(config);
    expect(fetchState.calls).toHaveLength(0);
    expect(cap.lines).toEqual(["\x1b[31m  Operación cancelada.\x1b[0m"]);
  });

  it("avisa cuando no se encuentra la ciudad", async () => {
    promptMock.mockResolvedValue("Roma");
    enqueueGeocodeResults([]);
    const config = baseConfig();
    const result = await addCity(config);
    expect(result).toBe(config);
    expect(cap.lines).toEqual(["\x1b[31m  No se encontró la ciudad.\x1b[0m"]);
  });

  it("agrega la ciudad cuando hay un solo candidato", async () => {
    promptMock.mockResolvedValue("Roma");
    enqueueGeocodeResults([
      {
        name: "Roma",
        country: "Italia",
        admin1: "Región de Lacio",
        latitude: 41.89193,
        longitude: 12.51133,
      },
    ]);
    const config = baseConfig();
    const result = await addCity(config);
    expect(result.cities).toEqual([roma]);
    expect(askIndexMock).not.toHaveBeenCalled();
    expect(cap.lines).toEqual(["\x1b[32m  Se agregó Roma — Región de Lacio, Italia.\x1b[0m"]);
  });

  it("selecciona un candidato cuando hay varios", async () => {
    promptMock.mockResolvedValue("Beijing");
    enqueueGeocodeResults([
      {
        name: "Roma",
        country: "Italia",
        admin1: "Región de Lacio",
        latitude: 41.89193,
        longitude: 12.51133,
      },
      { name: "Beijing", country: "China", latitude: 25.07655, longitude: 114.26569 },
    ]);
    askIndexMock.mockResolvedValue(1);
    const config = baseConfig();
    const result = await addCity(config);
    expect(result.cities).toEqual([beijing]);
    expect(askIndexMock).toHaveBeenCalledWith("  Selecciona una opción: ", 2);
    expect(cap.lines).toEqual([
      "  1. Roma — Región de Lacio, Italia",
      "  2. Beijing — China",
      "\x1b[32m  Se agregó Beijing — China.\x1b[0m",
    ]);
  });

  it("avisa cuando la selección es inválida", async () => {
    promptMock.mockResolvedValue("Beijing");
    enqueueGeocodeResults([
      {
        name: "Roma",
        country: "Italia",
        admin1: "Región de Lacio",
        latitude: 41.89193,
        longitude: 12.51133,
      },
      { name: "Beijing", country: "China", latitude: 25.07655, longitude: 114.26569 },
    ]);
    askIndexMock.mockResolvedValue(null);
    const config = baseConfig();
    const result = await addCity(config);
    expect(result.cities).toEqual([]);
    expect(cap.lines).toEqual([
      "  1. Roma — Región de Lacio, Italia",
      "  2. Beijing — China",
      "\x1b[31m  Opción inválida.\x1b[0m",
    ]);
  });

  it("avisa cuando la ciudad ya está registrada", async () => {
    promptMock.mockResolvedValue("Roma");
    enqueueGeocodeResults([
      {
        name: "Roma",
        country: "Italia",
        admin1: "Región de Lacio",
        latitude: 41.89193,
        longitude: 12.51133,
      },
    ]);
    const config = baseConfig({ cities: [roma] });
    const result = await addCity(config);
    expect(result.cities).toEqual([roma]);
    expect(cap.lines).toEqual(["  Roma ya está registrada."]);
  });
});
