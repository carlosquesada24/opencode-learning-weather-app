import { beforeEach, afterEach, describe, expect, it } from "bun:test";
import { toggleUnit } from "../src/actions/settings.ts";
import type { Config } from "../src/types/Config.ts";
import { captureLogs, type LogCapture } from "./helpers.ts";

let cap: LogCapture;

beforeEach(() => {
  cap = captureLogs();
});

afterEach(() => {
  cap.restore();
});

describe("toggleUnit", () => {
  it("cambia de Celsius a Fahrenheit", () => {
    const config: Config = { defaultCity: null, cities: [], unit: "C" };
    const result = toggleUnit(config);
    expect(result.unit).toBe("F");
    expect(cap.lines).toEqual(["\x1b[32m  Unidad de temperatura: °F.\x1b[0m"]);
  });

  it("cambia de Fahrenheit a Celsius", () => {
    const config: Config = { defaultCity: null, cities: [], unit: "F" };
    const result = toggleUnit(config);
    expect(result.unit).toBe("C");
    expect(cap.lines).toEqual(["\x1b[32m  Unidad de temperatura: °C.\x1b[0m"]);
  });
});
