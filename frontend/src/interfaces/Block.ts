import {Piece} from "./Piece";

export interface Block {
  color: boolean;
  file: string;
  rank: number;
  piece?: Piece;
}
