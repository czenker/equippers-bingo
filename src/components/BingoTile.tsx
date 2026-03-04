import type { BingoTile as BingoTileType } from "../types";

interface Props {
  tile: BingoTileType;
  onClick: () => void;
}

export default function BingoTile({ tile, onClick }: Props) {
  const classes = [
    "bingo-tile",
    tile.marked ? "marked" : "",
    tile.isFreeSpace ? "free-space" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} onClick={onClick} disabled={tile.isFreeSpace}>
      {tile.isFreeSpace ? (
        <img src="./logo.svg" alt="Equippers Logo" className="free-space-logo" />
      ) : (
        <span>{tile.label}</span>
      )}
    </button>
  );
}
