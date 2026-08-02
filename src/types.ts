export interface Label {
  text: string;
  description?: string;
  category?: string;
}

export interface UIConfig {
  logoPath: string;
  primaryColor: string;
}

export interface Config {
  title: string;
  ui: UIConfig;
  labels: Record<string, Label>;
}

export interface BingoTile {
  label: string;
  description?: string;
  key?: string;
  marked: boolean;
  isFreeSpace: boolean;
}

export const GRID_SIZE = 5;
export const FREE_SPACE_INDEX = Math.floor((GRID_SIZE * GRID_SIZE) / 2);

export async function loadConfig(url = "./labels.json"): Promise<Config> {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load config from ${url}: ${res.status}`);
  const data: Config = await res.json();
  return data;
}

export async function loadLabels(url = "./labels.json"): Promise<Record<string, Label>> {
  const config = await loadConfig(url);
  return config.labels;
}

export function createTiles(labels: Record<string, Label>): BingoTile[] {
  // Convert object to array of entries and shuffle
  const entries = Object.entries(labels);
  let shuffledEntries = shuffle(entries);

  const categories = new Set<string>();

  const drawNextEntry = (): [string, Label] => {
    let entry: [string, Label] | undefined;
    do {
      entry = shuffledEntries.shift();
      if (!entry) throw new Error("Not enough labels to fill the grid");
    } while (entry[1].category && categories.has(entry[1].category));
    return entry;
  };

  const result = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
    if (i === FREE_SPACE_INDEX) {
      return {
        key: undefined,
        label: "FREI",
        description: undefined,
        marked: true,
        isFreeSpace: true,
      };
    }

    const [key, label] = drawNextEntry();
    if (label.category) categories.add(label.category);

    return {
      key,
      label: label.text,
      description: label.description,
      marked: false,
      isFreeSpace: false,
    };
  });
  return result;
}

/**
 * Create tiles from stored label keys, looking up current text from labels.
 * Used when restoring from localStorage.
 */
export function createTilesFromKeys(
  keys: string[],
  labels: Record<string, Label>,
  markedStates: boolean[]
): BingoTile[] {
  return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
    const isFree = i === FREE_SPACE_INDEX;
    const labelKey = keys[i];
    const labelData = labelKey ? labels[labelKey] : undefined;
    return {
      key: isFree ? undefined : labelKey,
      label: isFree ? "FREI" : (labelData?.text ?? `Feld ${i + 1}`),
      description: isFree ? undefined : labelData?.description,
      marked: markedStates[i] ?? isFree,
      isFreeSpace: isFree,
    };
  });
}

/** Shuffle an array in place (Fisher-Yates) and return a new copy. */
export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Check all winning lines (rows, cols, diagonals). */
export function checkWin(tiles: BingoTile[]): boolean {
  const size = GRID_SIZE;

  // rows
  for (let r = 0; r < size; r++) {
    if (tiles.slice(r * size, r * size + size).every((t) => t.marked)) return true;
  }

  // columns
  for (let c = 0; c < size; c++) {
    let col = true;
    for (let r = 0; r < size; r++) {
      if (!tiles[r * size + c].marked) {
        col = false;
        break;
      }
    }
    if (col) return true;
  }

  // diag top-left to bottom-right
  if (Array.from({ length: size }, (_, i) => tiles[i * size + i]).every((t) => t.marked))
    return true;

  // diag top-right to bottom-left
  if (
    Array.from({ length: size }, (_, i) => tiles[i * size + (size - 1 - i)]).every((t) => t.marked)
  )
    return true;

  return false;
}
