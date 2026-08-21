import type { Config } from "../types/Config.ts";
import type { MenuOption } from "../types/MenuOption.ts";
import { APP_TITLE, BAR } from "../utils/constants.ts";
import { cyan } from "../utils/colors.ts";

export function menuOptions(config: Config): MenuOption[] {
  return [
    { key: "1", label: "Clima de ciudad default" },
    { key: "2", label: `Clima de todas las ciudades (${config.cities.length})` },
    { key: "3", label: "Buscar y agregar ciudad" },
    { key: "4", label: "Eliminar ciudad" },
    { key: "5", label: "Establecer ciudad default" },
    { key: "6", label: "Pronóstico 7 días" },
    { key: "8", label: `Ajustes (°${config.unit})` },
    { key: "9", label: "Salir" },
  ];
}

export function printMenu(config: Config): void {
  console.log(cyan(BAR));
  console.log(cyan(APP_TITLE));
  console.log(cyan(BAR));
  for (const option of menuOptions(config)) {
    console.log(cyan(`  ${option.key}. ${option.label}`));
  }
  console.log(cyan(BAR));
}
