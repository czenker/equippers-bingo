import { useCallback, useEffect, useRef, useState } from "react";
import BingoCard from "./components/BingoCard";
import { checkWin, createTiles, loadLabels, shuffle, type BingoTile } from "./types";
import "./App.css";

const STORAGE_KEY = "equippers-bingo-state";

interface PersistedState {
  labels: string[];
  tiles: BingoTile[];
}

function saveState(labels: string[], tiles: BingoTile[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ labels, tiles }));
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded, etc.)
  }
}

function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.labels) && Array.isArray(parsed.tiles)) {
      return parsed as PersistedState;
    }
  } catch {
    // Corrupted data — ignore
  }
  return null;
}

// Read persisted state synchronously so it can be used as initial values
const persisted = loadPersistedState();

function App() {
  const [labels, setLabels] = useState<string[]>(persisted?.labels ?? []);
  const [tiles, setTiles] = useState<BingoTile[]>(persisted?.tiles ?? []);
  const [hasWon, setHasWon] = useState(() =>
    persisted ? checkWin(persisted.tiles) : false,
  );
  const [loading, setLoading] = useState(!persisted);

  // Track whether we've finished initialisation so we don't persist the empty
  // initial state back to localStorage before the real state is loaded.
  const initialised = useRef(!!persisted);

  // ── Fallback: fetch labels.json when nothing was persisted ──
  useEffect(() => {
    if (persisted) return;
    loadLabels().then((loaded) => {
      setLabels(loaded);
      setTiles(createTiles(shuffle(loaded)));
      setLoading(false);
      initialised.current = true;
    });
  }, []);

  // ── Persist whenever tiles or labels change ──
  useEffect(() => {
    if (initialised.current) {
      saveState(labels, tiles);
    }
  }, [labels, tiles]);

  const handleTileClick = useCallback((index: number) => {
    setTiles((prev) => {
      const next = prev.map((tile, i) =>
        i === index ? { ...tile, marked: !tile.marked } : tile,
      );
      setHasWon(checkWin(next));
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setTiles((prev) =>
      prev.map((tile) => ({
        ...tile,
        marked: tile.isFreeSpace,
      })),
    );
    setHasWon(false);
  }, []);

  const handleNewGame = useCallback(async () => {
    try {
      const freshLabels = await loadLabels();
      setLabels(freshLabels);
      setTiles(createTiles(shuffle(freshLabels)));
    } catch {
      // If fetching fails, fall back to the currently stored labels
      setTiles(createTiles(shuffle(labels)));
    }
    setHasWon(false);
  }, [labels]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="app">
        <p>Wird geladen...</p>
      </div>
    );
  }

  // ── Main bingo game ──
  return (
    <div className="app">
      <div className="app-sidebar">
        <div className="toolbar">
          <button className="btn" onClick={handleNewGame}>
            Neues Spiel
          </button>
          <button className="btn" onClick={handleReset}>
            Zur&uuml;cksetzen
          </button>
        </div>
      </div>
      <BingoCard tiles={tiles} onTileClick={handleTileClick} hasWon={hasWon} />
    </div>
  );
}

export default App;
