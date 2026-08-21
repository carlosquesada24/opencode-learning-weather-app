const RESET = "\x1b[0m";

function wrap(code: string, text: string): string {
  return `${code}${text}${RESET}`;
}

export function cyan(text: string): string {
  return wrap("\x1b[36m", text);
}

export function yellow(text: string): string {
  return wrap("\x1b[33m", text);
}

export function green(text: string): string {
  return wrap("\x1b[32m", text);
}

export function red(text: string): string {
  return wrap("\x1b[31m", text);
}
