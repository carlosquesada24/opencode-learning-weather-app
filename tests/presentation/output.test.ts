import { beforeEach, afterEach, describe, expect, it } from "bun:test";
import {
  message,
  success,
  error,
  highlight,
  cityLabel,
  cityList,
  weatherCity,
  forecastTitle,
  forecastDay,
} from "../../src/presentation/output.ts";
import type { City } from "../../src/types/City.ts";
import { captureLogs, type LogCapture } from "./helpers.ts";

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

let cap: LogCapture;

beforeEach(() => {
  cap = captureLogs();
});

afterEach(() => {
  cap.restore();
});

describe("cityLabel", () => {
  it("incluye la región si existe", () => {
    expect(cityLabel(roma)).toBe("Roma — Región de Lacio, Italia");
  });

  it("omite la región si no existe", () => {
    expect(cityLabel(beijing)).toBe("Beijing — China");
  });
});

describe("message", () => {
  it("imprime el texto tal cual", () => {
    message("  hola");
    expect(cap.lines).toEqual(["  hola"]);
  });
});

describe("success", () => {
  it("imprime en verde", () => {
    success("  ok");
    expect(cap.lines).toEqual(["\x1b[32m  ok\x1b[0m"]);
  });
});

describe("error", () => {
  it("imprime en rojo", () => {
    error("  mal");
    expect(cap.lines).toEqual(["\x1b[31m  mal\x1b[0m"]);
  });
});

describe("highlight", () => {
  it("imprime en amarillo", () => {
    highlight("  resaltado");
    expect(cap.lines).toEqual(["\x1b[33m  resaltado\x1b[0m"]);
  });
});

describe("cityList", () => {
  it("lista ciudades numeradas", () => {
    cityList([roma, beijing]);
    expect(cap.lines).toEqual([
      "  1. Roma — Región de Lacio, Italia",
      "  2. Beijing — China",
    ]);
  });
});

describe("weatherCity", () => {
  it("imprime la ciudad y la temperatura", () => {
    weatherCity(beijing, 21.5, "C");
    expect(cap.lines).toEqual(["  Beijing — China: \x1b[33m21.5 °C\x1b[0m"]);
  });
});

describe("forecastTitle", () => {
  it("imprime el título del pronóstico", () => {
    forecastTitle(roma);
    expect(cap.lines).toEqual([
      "  \x1b[33mPronóstico 7 días — Roma — Región de Lacio, Italia\x1b[0m",
    ]);
  });
});

describe("forecastDay", () => {
  it("imprime el día del pronóstico", () => {
    forecastDay({ date: "2026-08-21", tempMin: 10, tempMax: 20, weatherCode: 0 }, "C");
    expect(cap.lines).toEqual([
      "  \x1b[33mviernes 21 de agosto, 2026 — 10.0 °C / 20.0 °C — Despejado\x1b[0m",
    ]);
  });
});
