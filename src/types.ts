export interface BingoTile {
  label: string;
  marked: boolean;
  isFreeSpace: boolean;
}

export const GRID_SIZE = 5;
export const FREE_SPACE_INDEX = Math.floor((GRID_SIZE * GRID_SIZE) / 2);

export async function loadLabels(url = "./labels.json"): Promise<string[]> {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load labels from ${url}: ${res.status}`);
  const data: { labels: string[] } = await res.json();
  return data.labels;
}

export function createTiles(labels: string[]): BingoTile[] {
  return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
    const isFree = i === FREE_SPACE_INDEX;
    return {
      label: isFree ? "FREI" : (labels[i > FREE_SPACE_INDEX ? i - 1 : i] ?? `Feld ${i + 1}`),
      marked: isFree,
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
