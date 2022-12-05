import { Component, OnInit } from '@angular/core';
import {Block} from "../../interfaces/Block";
import {FENService} from "../../services/fen.service";
import {MoveService} from "../../services/move.service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  public board: Block[][] = [];
  private selectedPiece: string = "";
  private possiblePositions: string = "";
  private isWhitesTurn: boolean = true;

  private currentFEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  constructor(private FEN: FENService,
              private moves: MoveService) {
    for(let i=0; i<8; i++) {
      this.board.push([]);
      for(let j=0; j<8; j++) {
        this.board[i].push({color: (i+j)%2==0, file:String.fromCharCode(j+97), rank:8-i});
      }
    }
    this.FEN.displayFEN(this.currentFEN, this.board);
  }

  ngOnInit(): void {
  }

  private static getNotation(block: Block): string {
    return block.file + block.rank.toString();
  }

  public isMoveValid(block: Block): boolean {
    let i = 0;
    while (i < this.possiblePositions.length) {
      if (BoardComponent.getNotation(block) == this.possiblePositions.substring(i, i+2)) {
        return true;
      }
      i+=2;
    }
    return false;
  }

  private selectPiece(block: Block) {
    if (block.piece && block.piece.color === this.isWhitesTurn) {
      this.selectedPiece = block.file + block.rank.toString();
      this.possiblePositions = this.moves.calculatePossiblePositions(this.currentFEN, block.piece.type, BoardComponent.getNotation(block));
    }
  }

  public move(block: Block) {
    const rank = block.rank;
    const file = block.file;
    if (this.selectedPiece != "" && this.isMoveValid(block)) {
      this.currentFEN = this.FEN.movePiece(this.selectedPiece + file + rank.toString(), this.currentFEN);
      this.FEN.displayFEN(this.currentFEN, this.board);
      this.selectedPiece = "";
      this.possiblePositions = "";
      this.isWhitesTurn = !this.isWhitesTurn;
    } else {
        this.selectPiece(block);
    }
  }

  public dragStart(block: Block) {
    this.selectPiece(block);
  }

  public dragOver(e: any) {
    e.stopPropagation();
    e.preventDefault();
  }

  public drop(block: Block) {
    if(this.selectedPiece) {
      this.move(block);
    }
  }
}
