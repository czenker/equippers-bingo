export interface Label {
  text: string;
  description?: string;
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
  const shuffledEntries = shuffle(entries);
  
  // Extract keys and text values for tile creation
  const labelKeys = shuffledEntries.map(([key, _]) => key);
  const textLabels = shuffledEntries.map(([_, label]) => label.text);
  const descriptions = shuffledEntries.map(([_, label]) => label.description);
  
  return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
    const isFree = i === FREE_SPACE_INDEX;
    const adjustedIndex = i > FREE_SPACE_INDEX ? i - 1 : i;
    return {
      key: isFree ? undefined : labelKeys[adjustedIndex],
      label: isFree ? "FREI" : (textLabels[adjustedIndex] ?? `Feld ${i + 1}`),
      description: isFree ? undefined : descriptions[adjustedIndex],
      marked: isFree,
      isFreeSpace: isFree,
    };
  });
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
