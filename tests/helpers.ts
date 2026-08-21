export interface LogCapture {
  lines: string[];
  restore: () => void;
}

export function captureLogs(): LogCapture {
  const lines: string[] = [];
  const original = console.log;
  console.log = ((...args: unknown[]) => {
    lines.push(args.map(String).join(" "));
  }) as typeof console.log;
  return {
    lines,
    restore: () => {
      console.log = original;
    },
  };
}

export interface FetchCall {
  url: string;
}

interface MockResponseConfig {
  status?: number;
  body?: unknown;
}

export function mockFetch() {
  const original = globalThis.fetch;
  const queue: MockResponseConfig[] = [];
  const calls: FetchCall[] = [];
  globalThis.fetch = (async (input: string) => {
    const url = typeof input === "string" ? input : String(input);
    calls.push({ url });
    const config = queue.shift() ?? { status: 200, body: {} };
    const body = config.body === undefined ? "" : JSON.stringify(config.body);
    return new Response(body, {
      status: config.status ?? 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  return {
    calls,
    queue,
    restore: () => {
      globalThis.fetch = original;
    },
  };
}
