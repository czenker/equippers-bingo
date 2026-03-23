import { useCallback, useEffect, useRef, useState } from "react";
import BingoCard from "./components/BingoCard";
import {
  checkWin,
  createTiles,
  createTilesFromKeys,
  loadConfig,
  type BingoTile,
  type Label,
  type UIConfig,
} from "./types";
import "./App.css";

const STORAGE_KEY = "equippers-bingo-state";

interface PersistedState {
  labelKeys: string[];
  markedStates: boolean[];
}

function saveState(tiles: BingoTile[]) {
  try {
    const labelKeys = tiles.map((tile) => tile.key ?? "");
    const markedStates = tiles.map((tile) => tile.marked);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ labelKeys, markedStates })
    );
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded, etc.)
  }
}

function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.labelKeys) && Array.isArray(parsed.markedStates)) {
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
  const [labels, setLabels] = useState<Record<string, Label>>({});
  const [uiConfig, setUiConfig] = useState<UIConfig | null>(null);
  const [tiles, setTiles] = useState<BingoTile[]>([]);
  const [hasWon, setHasWon] = useState(false);
  const [loading, setLoading] = useState(true);

  // Track whether we've finished initialisation so we don't persist the empty
  // initial state back to localStorage before the real state is loaded.
  const initialised = useRef(false);

  // ── Load config, labels and restore or initialize tiles ──
  useEffect(() => {
    loadConfig().then((config) => {
      // Update page title
      document.title = config.title;
      setUiConfig(config.ui);
      setLabels(config.labels);

      let newTiles: BingoTile[];
      if (persisted) {
        // Restore from localStorage
        newTiles = createTilesFromKeys(
          persisted.labelKeys,
          config.labels,
          persisted.markedStates
        );
        setHasWon(checkWin(newTiles));
      } else {
        // Create new game
        newTiles = createTiles(config.labels);
      }

      setTiles(newTiles);
      setLoading(false);
      initialised.current = true;
    });
  }, []);

  // ── Persist whenever tiles change ──
  useEffect(() => {
    if (initialised.current) {
      saveState(tiles);
    }
  }, [tiles]);

  const handleTileClick = useCallback((index: number) => {
    setTiles((prev) => {
      const next = prev.map((tile, i) =>
        i === index ? { ...tile, marked: !tile.marked } : tile
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
      }))
    );
    setHasWon(false);
  }, []);

  const handleNewGame = useCallback(async () => {
    try {
      const config = await loadConfig();
      setLabels(config.labels);
      setTiles(createTiles(config.labels));
    } catch {
      // If fetching fails, fall back to creating new tiles with current labels
      setTiles(createTiles(labels));
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
      <BingoCard 
        tiles={tiles} 
        onTileClick={handleTileClick} 
        hasWon={hasWon}
        logoPath={uiConfig?.logoPath}
      />
    </div>
  );
}

export default App;
