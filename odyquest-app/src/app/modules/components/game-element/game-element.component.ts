import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { ChaseStatus, GameElement, Narrative, Quest } from 'chase-model';
import { GameService } from 'src/app/core/services/game.service';

@Component({
  selector: 'app-game-element',
  templateUrl: './game-element.component.html',
  styleUrls: ['./game-element.component.scss']
})
export class GameElementComponent implements OnInit {

  @Input() element: GameElement;
  @Output() selection: EventEmitter<number> = new EventEmitter();
  @Output() chaseStatus: EventEmitter<ChaseStatus> = new EventEmitter();

  constructor(private game: GameService) { }

  ngOnInit(): void {
  }

  selectDestination(destination: number) {
    this.selection.emit(destination);
  }

  setChaseStatus(status: ChaseStatus) {
    this.chaseStatus.emit(status);
  }

  isNarrative(element: GameElement): boolean {
    return element instanceof Narrative;
  }

  isQuest(element: GameElement): boolean {
    return element instanceof Quest;
  }
}
