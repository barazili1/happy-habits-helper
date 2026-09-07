export const SPECIAL_ID = "1729018123";

const DB = "https://x-men-256cc-default-rtdb.firebaseio.com";
const APPLE_PATH = `${DB}/m11.json`;
const CRASH_PATH = `${DB}/pre/hipr/hipr.json`;

export const ROWS = 10;
export const COLS = 5;

// عدد التفاح الفاسد في كل صف (من تحت لفوق)
export const BAD_PER_ROW = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];

export type AppleGrid = number[][]; // [row][col] -> 0 سليم / 1 فاسد

export function randomAppleGrid(): AppleGrid {
  return BAD_PER_ROW.map((bad) => {
    const row = Array.from({ length: COLS }, () => 0);
    const idx = Array.from({ length: COLS }, (_, i) => i);
    for (let i = idx.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j]!, idx[i]!];
    }
    idx.slice(0, bad).forEach((c) => {
      row[c] = 1;
    });
    return row;
  });
}

function flatten(grid: AppleGrid) {
  const out: Record<string, Record<string, string>> = {};
  grid.forEach((row, r) => {
    row.forEach((v, c) => {
      const key = `m${r * COLS + c + 1}`;
      out[key] = { [key]: String(v) };
    });
  });
  return out;
}

function parseApple(data: unknown): AppleGrid | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const grid: AppleGrid = [];
  for (let r = 0; r < ROWS; r += 1) {
    const row: number[] = [];
    for (let c = 0; c < COLS; c += 1) {
      const key = `m${r * COLS + c + 1}`;
      const node = obj[key] as Record<string, unknown> | undefined;
      const raw = node && typeof node === "object" ? node[key] : node;
      if (raw === undefined || raw === null) return null;
      row.push(Number(raw) === 1 ? 1 : 0);
    }
    grid.push(row);
  }
  return grid;
}

export async function fetchAppleGrid(): Promise<AppleGrid | null> {
  try {
    const res = await fetch(`${APPLE_PATH}?t=${Date.now()}`);
    if (!res.ok) return null;
    return parseApple(await res.json());
  } catch {
    return null;
  }
}

export async function resetAppleGrid(): Promise<AppleGrid> {
  const grid = randomAppleGrid();
  try {
    await fetch(APPLE_PATH, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flatten(grid)),
    });
  } catch {
    // تجاهل أخطاء الشبكة ونكمل محليًا
  }
  return grid;
}

function parseNumber(data: unknown): number | null {
  if (typeof data === "number" && Number.isFinite(data)) return data;
  if (typeof data === "string") {
    const n = Number(data.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  if (data && typeof data === "object") {
    for (const v of Object.values(data as Record<string, unknown>)) {
      const n = parseNumber(v);
      if (n !== null) return n;
    }
  }
  return null;
}

export async function fetchCrashOdds(): Promise<number | null> {
  try {
    const res = await fetch(`${CRASH_PATH}?t=${Date.now()}`);
    if (!res.ok) return null;
    return parseNumber(await res.json());
  } catch {
    return null;
  }
}
