import { beforeEach, afterEach, describe, expect, it } from "bun:test";
import { menuOptions, printMenu } from "../../src/presentation/menu.ts";
import { cyan } from "../../src/utils/colors.ts";
import { APP_TITLE, BAR } from "../../src/utils/constants.ts";
import type { Config } from "../../src/types/Config.ts";
import { captureLogs, type LogCapture } from "./helpers.ts";

const baseConfig: Config = {
  defaultCity: "Roma",
  cities: [
    { name: "Roma", country: "Italia", latitude: 41.89193, longitude: 12.51133 },
    { name: "Beijing", country: "China", latitude: 25.07655, longitude: 114.26569 },
  ],
  unit: "C",
};

let cap: LogCapture;

beforeEach(() => {
  cap = captureLogs();
});

afterEach(() => {
  cap.restore();
});

describe("menuOptions", () => {
  it("devuelve las opciones con el conteo de ciudades", () => {
    const options = menuOptions(baseConfig);
    expect(options).toEqual([
      { key: "1", label: "Clima de ciudad default" },
      { key: "2", label: "Clima de todas las ciudades (2)" },
      { key: "3", label: "Buscar y agregar ciudad" },
      { key: "4", label: "Eliminar ciudad" },
      { key: "5", label: "Establecer ciudad default" },
      { key: "6", label: "Pronóstico 7 días" },
      { key: "8", label: "Ajustes (°C)" },
      { key: "9", label: "Salir" },
    ]);
  });

  it("mostrar la temp unidad en Fahrenheit", () => {
    const options = menuOptions({ ...baseConfig, unit: "F" });
    expect(options.some((o) => o.label === "Ajustes (°F)")).toBe(true);
  });
});

describe("printMenu", () => {
  it("imprime el menú completo", () => {
    printMenu(baseConfig);
    expect(cap.lines).toEqual([
      cyan(BAR),
      cyan(APP_TITLE),
      cyan(BAR),
      cyan("  1. Clima de ciudad default"),
      cyan("  2. Clima de todas las ciudades (2)"),
      cyan("  3. Buscar y agregar ciudad"),
      cyan("  4. Eliminar ciudad"),
      cyan("  5. Establecer ciudad default"),
      cyan("  6. Pronóstico 7 días"),
      cyan("  8. Ajustes (°C)"),
      cyan("  9. Salir"),
      cyan(BAR),
    ]);
  });
});
