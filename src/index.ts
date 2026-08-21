import { addCity } from "./actions/addCity.ts";
import { forecast } from "./actions/forecast.ts";
import { getWeatherAll, getWeatherDefault } from "./actions/getWeather.ts";
import { removeCity } from "./actions/removeCity.ts";
import { setDefaultCity } from "./actions/setDefaultCity.ts";
import { toggleUnit } from "./actions/settings.ts";
import { closeInput, prompt } from "./presentation/input.ts";
import { printMenu } from "./presentation/menu.ts";
import { error, message } from "./presentation/output.ts";
import { loadCities, saveCities } from "./storage/citiesStorage.ts";
import { loadSettings, saveSettings } from "./storage/settingsStorage.ts";
import type { Config } from "./types/Config.ts";

function buildConfig(): Config {
  return { ...loadSettings(), cities: loadCities() };
}

async function main(): Promise<void> {
  let running = true;
  let config = buildConfig();
  console.log();

  while (running) {
    printMenu(config);
    const answer = (await prompt("  Selecciona una opción: ")).trim();

    try {
      switch (answer) {
        case "1":
          await getWeatherDefault(config);
          break;
        case "2":
          await getWeatherAll(config);
          break;
        case "3":
          config = await addCity(config);
          break;
        case "4":
          config = await removeCity(config);
          break;
        case "5":
          config = await setDefaultCity(config);
          break;
        case "6":
          await forecast(config);
          break;
        case "8":
          config = toggleUnit(config);
          break;
        case "9":
          running = false;
          break;
        default:
          error("  Opción inválida.");
          break;
      }
    } catch (errorCaught) {
      error(`  Error: ${errorCaught instanceof Error ? errorCaught.message : errorCaught}`);
    }

    saveCities(config.cities);
    saveSettings({ defaultCity: config.defaultCity, unit: config.unit });
    console.log();
  }

  closeInput();
}

main().catch((errorCaught) => {
  console.error(errorCaught);
  process.exit(1);
});
