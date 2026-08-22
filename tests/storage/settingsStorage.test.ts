import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { City } from "../../src/types/City.ts";
import type { TemperatureUnit } from "../../src/types/Config.ts";

const files = new Map<string, string>();
mock.module("node:fs", () => ({
  existsSync: (p: string) => files.has(p),
  readFileSync: (p: string) => files.get(p) ?? "",
  writeFileSync: (p: string, data: string) => {
    files.set(p, data);
  },
}));

import { loadSettings, saveSettings } from "../../src/storage/settingsStorage.ts";

const roma: City = {
  name: "Roma",
  country: "Italia",
  latitude: 41.89193,
  longitude: 12.51133,
};

beforeEach(() => {
  files.clear();
});

describe("loadSettings", () => {
  it("devuelve los valores por defecto sin archivo", () => {
    expect(loadSettings()).toEqual({ defaultCity: null, unit: "C" });
  });

  it("carga la configuración guardada", () => {
    files.set("data.json", JSON.stringify({ defaultCity: "Roma", cities: [roma], unit: "F" }));
    expect(loadSettings()).toEqual({ defaultCity: "Roma", unit: "F" });
  });
});

describe("saveSettings", () => {
  it("guarda la configuración y preserva las ciudades", () => {
    files.set("data.json", JSON.stringify({ defaultCity: "Beijing", cities: [roma], unit: "F" }));
    saveSettings({ defaultCity: "Roma", unit: "C" });

    const saved = JSON.parse(files.get("data.json")!) as {
      defaultCity: string | null;
      cities: City[];
      unit: TemperatureUnit;
    };
    expect(saved.defaultCity).toBe("Roma");
    expect(saved.unit).toBe("C");
    expect(saved.cities).toEqual([roma]);
  });

  it("crea el archivo con valores por defecto cuando no existe", () => {
    saveSettings({ defaultCity: null, unit: "C" });

    const saved = JSON.parse(files.get("data.json")!) as {
      defaultCity: string | null;
      cities: City[];
      unit: string;
    };
    expect(saved.defaultCity).toBeNull();
    expect(saved.unit).toBe("C");
    expect(saved.cities).toEqual([]);
  });
});
