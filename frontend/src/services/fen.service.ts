import { Injectable } from '@angular/core';
import {Block} from "../interfaces/Block";

@Injectable({
  providedIn: 'root'
})
export class FENService {

  constructor() { }

  // utility functions
  private static replaceAt(index: number, s: string, replacement: string): string {
    return s.substring(0, index) + replacement + s.substring(index + 1, s.length - 1 + replacement.length);
  }

  private static removePiece(FEN: string, i: number): string {
    return FEN.substring(0, i) + '1' + FEN.substring(i+1, FEN.length);
  }

  private static resetBoard(board: Block[][]) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        board[i][j].piece = undefined;
      }
    }
  }

  public displayFEN(FEN: string, board: Block[][]) {
    // TODO invalid input ??

    FENService.resetBoard(board);

    let x = 0;
    let y = 0;
    let i = 0;

    while (FEN[i] != " ") {
      if (FEN[i] === "/") {
        y++;
        x = 0;
        i++;
        continue;
      }
      if (!isNaN(parseInt(FEN[i]))) {
        x += parseInt(FEN[i]);
        i++;
        continue;
      }
      let color = false;
      let path = '../../assets/black-pieces/';

      if (FEN[i] === FEN[i].toUpperCase()) {
        color = true;
        path = '../../assets/white-pieces/'
      }
      path += `${FEN[i]}.png`;
      board[y][x].piece = {color, path, type: FEN[i]};
      x++;
      i++;
    }
  }

  public removePiece(move: string, FEN: string) {
    let i = 0;
    let piece: string = "";
    const pieceFile: number = parseInt(move[1]);
    let currFile: number = 8;

    while (pieceFile != currFile) {
      if (FEN[i] == "/") currFile--;
      i++;
    }

    const pieceRank: number = move.charCodeAt(0) - 96;
    let currRank: number = 1;

    while (pieceRank > currRank) {
      if (isNaN(parseInt(FEN[i]))) currRank++;
      else {
        currRank += parseInt(FEN[i]);
      }
      i++;
    }
    piece = FEN[i];
    return {FEN: FENService.removePiece(FEN, i), piece: piece};
  }

  public addPiece(move: string, FEN: string, piece: string) {
    let i = 0;
    const newFile: number = parseInt(move[1]);
    let currFile = 8;

    while (newFile != currFile) {
      if (FEN[i] == "/") currFile--;
      i++;
    }

    const newRank: number = move.charCodeAt(0) - 96;
    let currRank = 1;

    while (newRank > currRank) {
      if (isNaN(parseInt(FEN[i]))) currRank++;
      else {
        currRank += parseInt(FEN[i]);
      }
      i++;
    }

    if (newRank == currRank) {
      if (isNaN(parseInt(FEN[i]))) {
        FEN = FENService.replaceAt(i, FEN, piece);
      } else {
        const newString: string = piece + (parseInt(FEN[i])-1).toString();
        FEN = FENService.replaceAt(i, FEN, newString);
      }
    } else {
      const diff: number = currRank - newRank;
      const n: number = parseInt(FEN[i-1]);
      const newString = (n-diff).toString() + piece + (diff-1).toString();
      FEN = FENService.replaceAt(i-1, FEN, newString);
    }
    return FEN;
  }

  public movePiece(move: string, FEN: string): string {
    // Notation: "e4e5" -> whatever is on e4 moves to e5
    // 1) remove the piece from the starting square
    const removed: any = this.removePiece(move.substring(0, 2), FEN);
    FEN = removed.FEN;
    const piece = removed.piece;

    // 2) Add the piece to the new square
    return this.addPiece(move.substring(2, 4), FEN, piece);

  }
}
