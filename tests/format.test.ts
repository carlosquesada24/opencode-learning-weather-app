import { describe, expect, it } from "bun:test";
import { formatTemperature, weatherCodeLabel, formatForecastDay } from "../src/utils/format.ts";

describe("formatTemperature", () => {
  it("formatea con grados Celsius", () => {
    expect(formatTemperature(21.5, "C")).toBe("21.5 °C");
  });

  it("formatea con grados Fahrenheit", () => {
    expect(formatTemperature(-3.4, "F")).toBe("-3.4 °F");
  });

  it("redondea a un decimal", () => {
    expect(formatTemperature(12.34, "C")).toBe("12.3 °C");
  });

  it("formatea el cero", () => {
    expect(formatTemperature(0, "F")).toBe("0.0 °F");
  });
});

describe("weatherCodeLabel", () => {
  it("describe despejado", () => {
    expect(weatherCodeLabel(0)).toBe("Despejado");
  });

  it("describe parcialmente nublado", () => {
    expect(weatherCodeLabel(2)).toBe("Parcialmente nublado");
  });

  it("describe niebla", () => {
    expect(weatherCodeLabel(48)).toBe("Niebla");
  });

  it("describe lluvia", () => {
    expect(weatherCodeLabel(63)).toBe("Lluvia");
  });

  it("describe nieve", () => {
    expect(weatherCodeLabel(71)).toBe("Nieve");
  });

  it("describe cina de nieve (texto actual)", () => {
    expect(weatherCodeLabel(77)).toBe("Cina de nieve");
  });

  it("describe tormenta con granizo", () => {
    expect(weatherCodeLabel(99)).toBe("Tormenta con granizo");
  });

  it("devuelve guión para códigos desconocidos", () => {
    expect(weatherCodeLabel(123)).toBe("—");
  });
});

describe("formatForecastDay", () => {
  it("formatea el día completo", () => {
    const day = { date: "2026-08-21", tempMin: 10, tempMax: 20, weatherCode: 0 };
    expect(formatForecastDay(day, "C")).toBe(
      "viernes 21 de agosto, 2026 — 10.0 °C / 20.0 °C — Despejado",
    );
  });

  it("formatea con Fahrenheit y nieve", () => {
    const day = { date: "2026-01-01", tempMin: -3.4, tempMax: 5.6, weatherCode: 71 };
    expect(formatForecastDay(day, "F")).toBe(
      "jueves 1 de enero, 2026 — -3.4 °F / 5.6 °F — Nieve",
    );
  });
});
