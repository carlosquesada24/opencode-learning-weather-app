import { createInterface } from "node:readline";
import type { Interface } from "node:readline";

let rl: Interface | null = null;

function getRl(): Interface {
  if (!rl) {
    rl = createInterface({ input: process.stdin, output: process.stdout });
  }
  return rl;
}

export function prompt(question: string): Promise<string> {
  return new Promise((resolve) => getRl().question(question, resolve));
}

export async function askIndex(question: string, length: number): Promise<number | null> {
  const answer = (await prompt(question)).trim();
  const index = Number(answer) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= length) {
    return null;
  }
  return index;
}

export function closeInput(): void {
  rl?.close();
  rl = null;
}
