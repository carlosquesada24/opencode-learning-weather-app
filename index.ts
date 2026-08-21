import { createInterface } from "node:readline";
import { loadConfig, saveConfig } from "./src/storage.ts";
import { geocode } from "./src/geocoding.ts";
import { formatTemperature, getCurrentTemperature } from "./src/weather.ts";
import { cyan, green, red, yellow } from "./src/color.ts";
import type { City, Config } from "./src/types.ts";

const BAR = "═".repeat(40);
const rl = createInterface({ input: process.stdin, output: process.stdout });

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

function printMenu(config: Config): void {
  console.log(cyan(BAR));
  console.log(cyan("         WEATHER CLI"));
  console.log(cyan(BAR));
  console.log(cyan("  1. Clima de ciudad default"));
  console.log(cyan(`  2. Clima de todas las ciudades (${config.cities.length})`));
  console.log(cyan("  3. Buscar y agregar ciudad"));
  console.log(cyan("  4. Eliminar ciudad"));
  console.log(cyan("  5. Establecer ciudad default"));
  console.log(cyan(`  8. Ajustes (°${config.unit === "C" ? "C" : "F"})`));
  console.log(cyan("  9. Salir"));
  console.log(cyan(BAR));
}

async function showcaseCity(city: City, config: Config): Promise<void> {
  const temp = await getCurrentTemperature(city, config.unit);
  console.log(`  ${city.name}, ${city.country}: ${yellow(formatTemperature(temp, config.unit))}`);
}

async function handleWeatherDefault(config: Config): Promise<void> {
  if (!config.defaultCity) {
    console.log(red("  No hay una ciudad default definida."));
    return;
  }
  const city = config.cities.find((c) => c.name === config.defaultCity);
  if (!city) {
    console.log(red("  La ciudad default no está registrada."));
    return;
  }
  await showcaseCity(city, config);
}

async function handleWeatherAll(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("  No hay ciudades registradas.");
    return;
  }
  for (const city of config.cities) {
    await showcaseCity(city, config);
  }
}

async function handleAddCity(config: Config): Promise<Config> {
  const name = (await prompt("  Nombre de la ciudad: ")).trim();
  if (!name) {
    console.log(red("  Operación cancelada."));
    return config;
  }
  const city = await geocode(name);
  if (!city) {
    console.log(red("  No se encontró la ciudad."));
    return config;
  }
  if (config.cities.some((c) => c.name === city.name)) {
    console.log(`  ${city.name} ya está registrada.`);
    return config;
  }
  config.cities.push(city);
  console.log(green(`  Se agregó ${city.name}, ${city.country}.`));
  return config;
}

async function handleRemoveCity(config: Config): Promise<Config> {
  if (config.cities.length === 0) {
    console.log("  No hay ciudades registradas.");
    return config;
  }
  config.cities.forEach((city, i) => console.log(`  ${i + 1}. ${city.name}, ${city.country}`));
  const answer = (await prompt("  Número a eliminar: ")).trim();
  const index = Number(answer) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= config.cities.length) {
    console.log(red("  Opción inválida."));
    return config;
  }
  const removed = config.cities[index]!;
  config.cities.splice(index, 1);
  if (config.defaultCity === removed.name) {
    config.defaultCity = null;
  }
  console.log(green(`  Se eliminó ${removed.name}.`));
  return config;
}

async function handleSetDefault(config: Config): Promise<Config> {
  if (config.cities.length === 0) {
    console.log("  No hay ciudades registradas.");
    return config;
  }
  config.cities.forEach((city, i) => console.log(`  ${i + 1}. ${city.name}, ${city.country}`));
  const answer = (await prompt("  Número a establecer como default: ")).trim();
  const index = Number(answer) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= config.cities.length) {
    console.log(red("  Opción inválida."));
    return config;
  }
  config.defaultCity = config.cities[index]!.name;
  console.log(green(`  Ciudad default: ${config.defaultCity}.`));
  return config;
}

function handleToggleUnit(config: Config): Config {
  config.unit = config.unit === "C" ? "F" : "C";
  console.log(green(`  Unidad de temperatura: °${config.unit}.`));
  return config;
}

async function main(): Promise<void> {
  let running = true;
  let config = loadConfig();
  console.log();

  while (running) {
    printMenu(config);
    const answer = (await prompt("  Selecciona una opción: ")).trim();

    try {
      switch (answer) {
        case "1":
          await handleWeatherDefault(config);
          break;
        case "2":
          await handleWeatherAll(config);
          break;
        case "3":
          config = await handleAddCity(config);
          break;
        case "4":
          config = await handleRemoveCity(config);
          break;
        case "5":
          config = await handleSetDefault(config);
          break;
        case "8":
          config = handleToggleUnit(config);
          break;
        case "9":
          running = false;
          break;
        default:
          console.log(red("  Opción inválida."));
          break;
      }
    } catch (error) {
      console.log(red(`  Error: ${error instanceof Error ? error.message : error}`));
    }

    saveConfig(config);
    console.log();
  }

  rl.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
