import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { City } from "../../src/types/City.ts";

const files = new Map<string, string>();
mock.module("node:fs", () => ({
  existsSync: (p: string) => files.has(p),
  readFileSync: (p: string) => files.get(p) ?? "",
  writeFileSync: (p: string, data: string) => {
    files.set(p, data);
  },
}));

import { loadCities, saveCities } from "../../src/storage/citiesStorage.ts";

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

beforeEach(() => {
  files.clear();
});

describe("loadCities", () => {
  it("devuelve una lista vacía sin archivo", () => {
    expect(loadCities()).toEqual([]);
  });

  it("carga las ciudades guardadas", () => {
    files.set("data.json", JSON.stringify({ defaultCity: "Roma", cities: [roma], unit: "C" }));
    expect(loadCities()).toEqual([roma]);
  });
});

describe("saveCities", () => {
  it("guarda las ciudades y preserva la configuración", () => {
    files.set("data.json", JSON.stringify({ defaultCity: "Roma", cities: [beijing], unit: "F" }));
    saveCities([roma]);

    const saved = JSON.parse(files.get("data.json")!) as {
      defaultCity: string | null;
      cities: City[];
      unit: string;
    };
    expect(saved.cities).toEqual([roma]);
    expect(saved.defaultCity).toBe("Roma");
    expect(saved.unit).toBe("F");
    expect(loadCities()).toEqual([roma]);
  });

  it("crea el archivo con valores por defecto cuando no existe", () => {
    saveCities([roma]);

    const saved = JSON.parse(files.get("data.json")!) as {
      defaultCity: string | null;
      cities: City[];
      unit: string;
    };
    expect(saved.defaultCity).toBeNull();
    expect(saved.unit).toBe("C");
    expect(saved.cities).toEqual([roma]);
  });
});
