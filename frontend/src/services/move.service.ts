import { Injectable } from '@angular/core';
import {FENService} from "./fen.service";

@Injectable({
  providedIn: 'root'
})
export class MoveService {
  private static FEN: FENService;

  constructor() { }

  private static isWhite(piece: string): boolean {
    return piece.toUpperCase() == piece;
  }

  private static isPositionValid(position: string): boolean {
    return (position.charCodeAt(0) >= 97 && position.charCodeAt(0) <= 104
      && parseInt(position[1]) >= 1 && parseInt(position[1]) <= 8)
  }

  private static calculateNewPosition(oldPosition: string, move: number[]): string {
    const pos = String.fromCharCode(oldPosition.charCodeAt(0) + move[0]) + (parseInt(oldPosition[1]) + move[1]).toString();
    if (pos.length == 2) return pos;
    else return "q9";
  }

  private static getPieceAtSquare(FEN: string, position: string): string {

    let i = 0;
    let piece: string = "";
    const pieceFile: number = parseInt(position[1]);
    let currFile: number = 8;

    while (pieceFile != currFile) {
      if (FEN[i] == "/") currFile--;
      i++;
    }

    const pieceRank: number = position.charCodeAt(0) - 96;
    let currRank: number = 1;

    while (pieceRank > currRank) {
      if (isNaN(parseInt(FEN[i]))) currRank++;
      else {
        currRank += parseInt(FEN[i]);
      }
      i++;
    }
    if (pieceRank === currRank) {
      if (isNaN(parseInt(FEN[i])) && FEN[i] != "/") return FEN[i];
      return "";
    } else {
      return "";
    }
  }

  private static collisionStatus(FEN: string, position: string, color: boolean): number {
    // 0 no collision
    // 1: collision with the same color piece
    // -1: collision with a different color piece

    const pieceAtSquare: string = MoveService.getPieceAtSquare(FEN, position);
    if (pieceAtSquare === "") return 0;
    if (color === MoveService.isWhite(pieceAtSquare)) return 1;
    return -1;
  }

  private static knightMove(FEN: string, position: string, color: boolean) {
    let possiblePositions: string = "";
    const possibleMoves: number[][] = [[2, 1], [2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2], [-2, 1], [-2, -1]];
    for(let i=0; i<possibleMoves.length; i++) {
      const newPosition: string = MoveService.calculateNewPosition(position, possibleMoves[i]);
      if(MoveService.isPositionValid(newPosition) && MoveService.collisionStatus(FEN, newPosition, color) != 1) {
        possiblePositions += newPosition;
      }
    }
    return possiblePositions;
  }

  private static bishopMove(FEN: string, position: string, color: boolean): string {
    let possiblePositions: string = "";
    let xDirection: number = 1;
    let yDirection: number = 1;
    for(let i=0; i<4; i++) {
      let j = 1;
      let continueInDirection: boolean = true;
      while(continueInDirection) {
        const newPosition = MoveService.calculateNewPosition(position, [j*xDirection, j*yDirection]);
        if (MoveService.isPositionValid(newPosition)){
          const colState = MoveService.collisionStatus(FEN, newPosition, color);
          if (colState === 0) {
            possiblePositions += newPosition;
          }
          if (colState === -1) {
            possiblePositions += newPosition;
            continueInDirection = false;
          }
          if (colState === 1) {
            continueInDirection = false;
          }
        } else continueInDirection = false;
        j++;
      }
      if(i==0) yDirection = -1;
      if(i==1) xDirection = -1;
      if(i==2) yDirection = 1;
    }
    return possiblePositions;
  }

  private static rookMove(FEN: string, position: string, color: boolean) {
    let possiblePositions: string = "";
    for(let i=0; i<4; i++) {
      let j = 1;
      let continueInDirection: boolean = true;
      let newPosition : string = "";
      while(continueInDirection) {
        switch (i) {
          case 0:
            newPosition = MoveService.calculateNewPosition(position, [j, 0]);
            break;
          case 1:
            newPosition = MoveService.calculateNewPosition(position, [0, j]);
            break;
          case 2:
            newPosition = MoveService.calculateNewPosition(position, [-j, 0]);
            break;
          case 3:
            newPosition = MoveService.calculateNewPosition(position, [0, -j]);
            break;
        }
        if (MoveService.isPositionValid(newPosition)){
          const colState = MoveService.collisionStatus(FEN, newPosition, color);
          if (colState === 0) {
            possiblePositions += newPosition;
          }
          if (colState === -1) {
            possiblePositions += newPosition;
            continueInDirection = false;
          }
          if (colState === 1) {
            continueInDirection = false;
          }
        } else continueInDirection = false;
        j++;
      }
    }
    return possiblePositions;
  }

  private static queenMove(FEN: string, position: string, color: boolean): string {
    return MoveService.bishopMove(FEN, position, color) + MoveService.rookMove(FEN, position, color);
  }

  private static pawnMove(FEN: string, position: string, color: boolean): string {
    let possiblePositions: string = "";
    if (color) {
      let newPosition = MoveService.calculateNewPosition(position, [0, 1]);
      if (MoveService.isPositionValid(newPosition) && MoveService.collisionStatus(FEN, newPosition, color) === 0) {
        possiblePositions += newPosition;
        if (position[1] == "2") {
          newPosition = MoveService.calculateNewPosition(position, [0, 2]);
          if (MoveService.isPositionValid(newPosition) && MoveService.collisionStatus(FEN, newPosition, color) === 0) {
            possiblePositions += newPosition;
          }
        }
      }
      const takeOne = MoveService.calculateNewPosition(position, [1, 1]);
      const takeTwo = MoveService.calculateNewPosition(position, [-1, 1]);
      if (this.collisionStatus(FEN, takeOne, color) === -1) possiblePositions += takeOne;
      if (this.collisionStatus(FEN, takeTwo, color) === -1) possiblePositions += takeTwo;
    } else {
      let newPosition = MoveService.calculateNewPosition(position, [0, -1]);
      if (MoveService.isPositionValid(newPosition) && MoveService.collisionStatus(FEN, newPosition, color) === 0) {
        possiblePositions += newPosition;
        if (position[1] == "7") {
          newPosition = MoveService.calculateNewPosition(position, [0, -2]);
          if (MoveService.isPositionValid(newPosition) && MoveService.collisionStatus(FEN, newPosition, color) === 0) {
            possiblePositions += newPosition;
          }
        }
      }
      const takeOne = MoveService.calculateNewPosition(position, [1, -1]);
      const takeTwo = MoveService.calculateNewPosition(position, [-1, -1]);
      if (this.collisionStatus(FEN, takeOne, color) === -1) possiblePositions += takeOne;
      if (this.collisionStatus(FEN, takeTwo, color) === -1) possiblePositions += takeTwo;
    }

    return possiblePositions;
  }

  private static kingMove(FEN: string, position: string, color: boolean): string {
    let possiblePositions: string = "";
    for(let i=-1; i<=1; i++) {
      for(let j=-1; j<=1; j++) {
        const newPosition: string = MoveService.calculateNewPosition(position, [i, j]);
        if (MoveService.isPositionValid(newPosition) && MoveService.collisionStatus(FEN, newPosition, color) != 1) {
          possiblePositions += newPosition;
        }
      }
    }

    console.log(this.calculateNewPosition(position, [2, 0]));
    console.log(this.calculateNewPosition(position, [1, 0]));

    // castling
    if (color) {
      let castleSquare = this.getPieceAtSquare(FEN, MoveService.calculateNewPosition(position, [2, 0]));
      if (this.getPieceAtSquare(FEN, MoveService.calculateNewPosition(position, [1, 0])) == "" &&
          this.getPieceAtSquare(FEN, castleSquare) == "") {
        possiblePositions += castleSquare;
      }
    //   castleSquare = this.getPieceAtSquare(FEN, MoveService.calculateNewPosition(position, [-3, 0]));
    //   if (this.getPieceAtSquare(FEN, this.getPieceAtSquare(FEN, this.calculateNewPosition(position, [-1, 0]))) === "" &&
    //       this.getPieceAtSquare(FEN, this.getPieceAtSquare(FEN, this.calculateNewPosition(position, [-2, 0]))) === "" &&
    //     this.getPieceAtSquare(FEN, castleSquare) == "") {
    //     possiblePositions += castleSquare;
    //   }
    }
    return possiblePositions;
  }

  public calculatePossiblePositions(FEN: string, piece: string, position: string): string {
    switch (piece.toLowerCase()) {
      case 'n':
        return MoveService.knightMove(FEN, position, MoveService.isWhite(piece));
      case 'b':
        return MoveService.bishopMove(FEN, position, MoveService.isWhite(piece));
      case 'r':
        return MoveService.rookMove(FEN, position, MoveService.isWhite(piece));
      case 'q':
        return MoveService.queenMove(FEN, position, MoveService.isWhite(piece));
      case 'p':
        return MoveService.pawnMove(FEN, position, piece.toLowerCase() != piece);
      case 'k':
        return MoveService.kingMove(FEN, position, MoveService.isWhite(piece));
      default:
        console.log("Are you insane?");
        return "a";
    }
  }
}
