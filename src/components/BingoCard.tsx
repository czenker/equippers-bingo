import { GRID_SIZE, type BingoTile as BingoTileType } from "../types";
import BingoTile from "./BingoTile";

interface Props {
  tiles: BingoTileType[];
  onTileClick: (index: number) => void;
  hasWon: boolean;
  logoPath?: string;
}

export default function BingoCard({ tiles, onTileClick, hasWon, logoPath }: Props) {
  return (
    <div className="bingo-card-wrapper">
      {hasWon && <div className="win-banner">BINGO!</div>}
      <div
        className="bingo-grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {tiles.map((tile, i) => (
          <BingoTile key={i} tile={tile} onClick={() => onTileClick(i)} logoPath={logoPath} />
        ))}
      </div>
    </div>
  );
}
