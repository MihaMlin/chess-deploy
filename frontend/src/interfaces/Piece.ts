enum Type {
  pawn,
  bishop,
  knight,
  rook,
  queen,
  king
}

export interface Piece {
  color: boolean;
  path: string;
  type: string;
}
