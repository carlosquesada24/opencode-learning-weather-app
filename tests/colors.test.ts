import { describe, expect, it } from "bun:test";
import { cyan, yellow, green, red } from "../src/utils/colors.ts";

describe("colors", () => {
  it("envolver en cyan", () => {
    expect(cyan("hola")).toBe("\x1b[36mhola\x1b[0m");
  });

  it("envolver en amarillo", () => {
    expect(yellow("temp")).toBe("\x1b[33mtemp\x1b[0m");
  });

  it("envolver en verde", () => {
    expect(green("ok")).toBe("\x1b[32mok\x1b[0m");
  });

  it("envolver en rojo", () => {
    expect(red("error")).toBe("\x1b[31merror\x1b[0m");
  });
});
