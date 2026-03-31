import { useRef, useState } from "react";
import type { BingoTile as BingoTileType } from "../types";
import DescriptionModal from "./DescriptionModal";
import DescriptionIcon from "./DescriptionIcon";

interface Props {
  tile: BingoTileType;
  onClick: () => void;
  logoPath?: string;
}

const LONG_PRESS_DURATION = 500; // milliseconds

export default function BingoTile({ tile, onClick, logoPath }: Props) {
  const [showDescription, setShowDescription] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseDown = () => {
    if (tile.isFreeSpace || !tile.description) return;

    longPressTimer.current = setTimeout(() => {
      setShowDescription(true);
    }, LONG_PRESS_DURATION);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchStart = () => {
    if (tile.isFreeSpace || !tile.description) return;

    longPressTimer.current = setTimeout(() => {
      setShowDescription(true);
    }, LONG_PRESS_DURATION);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const hasDescription = tile.description && !tile.isFreeSpace;

  // Determine border color based on tile state
  const getBorderColor = (): string => {
    if (tile.marked) {
      return "#cc1258"; // Dark red for marked tiles
    }
    return "#3a3a3a"; // Default gray
  };

  const classes = [
    "bingo-tile",
    tile.marked ? "marked" : "",
    tile.isFreeSpace ? "free-space" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <button
        className={classes}
        onClick={onClick}
        disabled={tile.isFreeSpace}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {tile.isFreeSpace ? (
          <img src={logoPath ?? "./logo.svg"} alt="Equippers Logo" className="free-space-logo" />
        ) : (
          <>
            <span>{tile.label}</span>
            {hasDescription && (
              <div className="description-indicator">
                <DescriptionIcon borderColor={getBorderColor()} />
              </div>
            )}
          </>
        )}
      </button>
      {showDescription && tile.description && (
        <DescriptionModal
          title={tile.label}
          description={tile.description}
          onClose={() => setShowDescription(false)}
        />
      )}
    </>
  );
}
