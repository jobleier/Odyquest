import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { CombineLatestSubscriber } from 'rxjs/internal/observable/combineLatest';

import { GameElement } from 'chase-model';
import { Quest, QuestType } from 'chase-model';
import {
  Narrative,
  NarrativeType,
  NarrativeStatus,
  Image
} from 'chase-model';
import { Media } from 'chase-model';
import { XButton } from 'chase-model';
import { Chase } from 'chase-model';
import { LogicType, SolutionTerm } from 'chase-model';
import { Description } from 'chase-model';

import { ChaseEditorService } from 'src/app/services/chase-editor.service';

@Component({
  selector: 'app-quest-editor',
  templateUrl: './quest-editor.component.html',
  styleUrls: ['./quest-editor.component.scss'],
})
export class QuestEditorComponent implements OnInit {
  gameElement: GameElement = new Narrative();

  is_quest: boolean;
  is_narrative: boolean;

  // Quest
  solutionItems: Array<string>;
  combinationMap: Array<SolutionTerm>;
  maxTries: number;
  maxTime: number;
  public quest_type_status_int; // "Text" = 1, "MultipleChoice" = 2
  questType: QuestType;
  display_image_first: boolean;
  solution_type_status_int: Array<number>;
  solution_destination_description: Array<string>;

  // Narrative
  narrative_status: NarrativeStatus;
  public selected_narrative_status_int = 1; // "Continue" = 1, "Win" = 2, "Loose" = 3
  narrative_type: NarrativeType;

  buttons: Array<XButton>;
  buttonDestinationList: Array<string>;

  initial_setup = true;

  constructor(
    private cd: ChangeDetectorRef,
    private chaseEditor: ChaseEditorService
  ) {}

  ngOnInit(): void {}

  onQuestTypeChange(value: string) {
    console.log('Changed quest type to ' + value);
    switch (value) {
      case '1':
        this.questType = QuestType.Text;
        break;
      case '2':
        this.questType = QuestType.MultipleChoice;
        break;
    }
  }

  onSolutionTypeStatusChange(value: string, index: number) {
    console.log('Changed solution type on index ' + index + ' to ' + value);
    switch (value) {
      case '1':
        this.questType = QuestType.Text;
        break;
      case '2':
        this.questType = QuestType.MultipleChoice;
        break;
    }
  }

  onNarrativeStatusChange(value: number) {
    console.log('Narrative status to ' + value);
    switch (value) {
      case 1: // "Continue"
        this.narrative_status = NarrativeStatus.Continue;
        console.log(this.selected_narrative_status_int);
        break;
      case 2: // "Win"
        this.narrative_status = NarrativeStatus.Win;
        console.log(this.selected_narrative_status_int);
        break;
      case 3: // "Loose"
        this.narrative_status = NarrativeStatus.Loose;
        console.log(this.selected_narrative_status_int);
        break;
    }
  }

  onNarrativeTypeChange(value: NarrativeType) {
    console.log('Narrative type to ' + value);
    this.narrative_type = value;
  }

  onNarrativeButtonDestinationChange(index: number, value: string) {
    this.buttons[index].destination = this.chaseEditor.getElementIdByName(value);
    this.buttonDestinationList[index] = value;
  }

  onCombinationMapDestinationChange(index: number, value: string) {
    this.combinationMap[index].destination = this.chaseEditor.getElementIdByName(value);
  }

  deleteNarrativeButton(index: number) {
    console.log('deleteNarrativeButton(' + index + ')');
    this.buttons.splice(index, 1);
    this.buttonDestinationList.splice(index, 1);
  }

  deleteHelpText(index: number) {
    console.log('deleteHelpText(' + index + ')');
    this.gameElement.help.splice(index, 1);
  }

  onTitleChange(): void {
    console.log('title changed!');

    // save data so the MainCOmponent can access it, then recreate the quest list
    this.localToGameElement();
    // TODO this.main_editor.loadDataFromChase();
  }

  deleteQuestSolution(index: number) {
    console.log('deleteQuestSolution(' + index + ')');
    this.solutionItems.splice(index, 1);
    for (const cm of this.combinationMap) {
      cm.requiredItems.splice(index, 1);
    }

    // todo need to update various other stuff
  }

  deleteSolutionCombination(index: number) {
    console.log('deleteSolutionCombination(' + index + ')');

    this.combinationMap.splice(index, 1);
    this.solution_type_status_int.splice(index, 1);
    // this.solution_destination_description.splice(index, 1);
  }

  updateSolutionItem(event, index) {
    this.solutionItems[index] = event.target.value;
  }

  addButton() {
    console.log('addButton()');

    const button = new XButton();
    button.name = 'Weiter'; // FIXME localize
    // just use some id which is actually existing
    button.destination = this.chaseEditor.getElementIdByName(
      this.chaseEditor.getElementNames()[0]
    );

    this.buttons.push(button);
    // this.buttonDestinationList[this.gameElementsList[0]];
  }

  addHelpText() {
    console.log('addHelpText()', this.gameElement.help);

    const helpText = new Description();
    helpText.text = 'HilfeText'; // FIXME localize
    this.gameElement.help.push(helpText);

  }

  addSolutionItem() {
    console.log('addSolutionItem()');

    const solution = 'Neue Lösung';

    // todo need to update various other stuff
    for (let comb = 0; comb < this.combinationMap.length; comb++) {
      this.combinationMap[comb].requiredItems.push(true);
    }

    // just use some id which is actually existing
    // button.destination = this.this.chaseEditor.getElementIdByName(this.gameElementsMap.values().next().value);

    this.solutionItems.push(solution);
  }

  addSolutionCombination() {
    console.log('addSolutionCombination()');

    // let combination = this.combinationMap.values().next().value;
    let new_comb = new SolutionTerm();
    new_comb.destination = 1;
    new_comb.logicType = LogicType.And;
    new_comb.requiredItems = [];

    for (
      let i = 0;
      i < this.combinationMap.values().next().value.requiredItems.length;
      i++
    ) {
      new_comb.requiredItems.push(true);
    }

    this.combinationMap.push(new_comb);
    this.solution_type_status_int.push(1);
    this.solution_destination_description.push(this.chaseEditor.getElementNames()[0]);
  }

  gameElementToLocal(): void {
    // Individual stuff
    if (this.gameElement instanceof Quest) {
      this.solutionItems =
        this.gameElement.requirementCombination.solutionItems;
      this.combinationMap =
        this.gameElement.requirementCombination.combinationMap;
      this.maxTries = this.gameElement.maxTries;
      this.questType = this.gameElement.questType;

      this.display_image_first = this.gameElement.displayImageFirst;

      if (this.gameElement.maxTime !== undefined) {
        this.maxTime = this.gameElement.maxTime.getTime() / 1000;
      } else {
        this.maxTime = 0;
      }

      switch (this.questType) {
        case QuestType.Text:
          this.quest_type_status_int = 1;
          break;
        case QuestType.MultipleChoice:
          this.quest_type_status_int = 2;
          break;
      }

      this.solution_type_status_int = [];
      this.solution_destination_description = new Array<string>();
      let counter = 0;
      for (const cm of this.gameElement.requirementCombination.combinationMap) {
        this.solution_destination_description.push(this.chaseEditor.getElementNameById(cm.destination));
        if (cm.logicType === LogicType.And) {
          this.solution_type_status_int[counter] = 1;
        } else {
          this.solution_type_status_int[counter] = 2;
        }
        counter++;
      }
    } else if (this.gameElement instanceof Narrative) {
      this.narrative_status = this.gameElement.narrativeStatus;
      if (this.narrative_status === NarrativeStatus.Continue) {
        this.selected_narrative_status_int = 1;
      } else if (this.narrative_status === NarrativeStatus.Win) {
        this.selected_narrative_status_int = 2;
      } else {
        this.selected_narrative_status_int = 3;
      }

      this.narrative_type = this.gameElement.narrativeType;

      console.log('loaded narrative status as: ', this.narrative_status);
      this.buttons = this.gameElement.buttons;
      this.buttonDestinationList = new Array<string>();
      for (const button of this.buttons) {
        this.buttonDestinationList.push(this.chaseEditor.getElementNameById(button.destination));
      }
      console.log('Number of Buttons: ', this.buttons.length);
    }
  }

  localToGameElement(): void {
    // common to all GameElements
    // this.gameElement.help = this.help;

    // Individual stuff
    if (this.gameElement instanceof Quest) {
      this.gameElement.requirementCombination.solutionItems =
        this.solutionItems;
      this.gameElement.requirementCombination.combinationMap =
        this.combinationMap;
      this.gameElement.maxTries = this.maxTries;
      this.gameElement.questType = this.questType;

      this.gameElement.displayImageFirst = this.display_image_first;

      let counter = 0;
      for (const cm of this.gameElement.requirementCombination.combinationMap) {
        cm.destination = this.chaseEditor.getElementIdByName(this.solution_destination_description[counter]);
        if (this.solution_type_status_int[counter] === 1) {
          cm.logicType = LogicType.And;
        } else {
          cm.logicType = LogicType.Or;
        }
        counter++;
      }
      // why use date?
      const t = new Date(0); // Epoch
      t.setSeconds(this.maxTime);
      this.gameElement.maxTime = t;

      if (this.quest_type_status_int === 1) {
        this.gameElement.questType = QuestType.Text;
      } else {
        this.gameElement.questType = QuestType.MultipleChoice;
      }
    } else if (this.gameElement instanceof Narrative) {
      this.gameElement.narrativeStatus = this.narrative_status;
      this.gameElement.narrativeType = this.narrative_type;
      this.gameElement.buttons = this.buttons;
    }
  }

  reloadChase(): void {
    // this.chaseEditor.getChase() = chase;

    // create gameelementsmap (id -> string)
    // also create simple array used to generate dropdown values
  }

  setGameElementToEdit(gm: GameElement): void {
    if (this.initial_setup) {
      this.initial_setup = false;
    } else {
      // save all stuff that was done in the old editor
      this.localToGameElement();
    }

    this.gameElement = gm;

    if (gm instanceof Quest) {
      console.log('Loading Quest in Editor');
      this.is_quest = true;
      this.is_narrative = false;
    } else if (gm instanceof Narrative) {
      console.log('Loading Narrative in Editor');
      this.is_quest = false;
      this.is_narrative = true;
    }
    console.log('Title: ' + this.gameElement.title);

    this.gameElementToLocal();

    // we need to manually tell angular that changes occured:
    this.cd.detectChanges();
  }

  getElementFromMap(index: number): string {
    return this.chaseEditor.getElementNameById(index);
  }

  save(): void {
    console.log('save');
    this.localToGameElement();
    // todo it seems TypeScript only uses references anyways... so the values are actually the same on GameElement and this
    // -> already written
  }

  reset(): void {
    console.log('reset');
    this.gameElementToLocal();
    // -> reset values get
  }

  getChaseId(): string {
    if (this.chaseEditor.getChase() && this.chaseEditor.getChase().metaData.chaseId) {
      return this.chaseEditor.getChase().metaData.chaseId;
    }
  }

  updateImage(image: Image): void {
    this.gameElement.description.image = image;
  }

  updateMedia(media: Media): void {
    (this.gameElement as Narrative).setCurrentMedia(media);
  }

  updateHelpImage(helpId: number, image: Image): void {
    this.gameElement.help[helpId].image = image;
  }

  getNarrativeType(type: string): NarrativeType {
    switch (type) {
      case NarrativeType.Text:
        return NarrativeType.Text;
      case NarrativeType.Audio:
        return NarrativeType.Audio;
      case NarrativeType.Video:
        return NarrativeType.Video;
    }
  }

  hasMedia(): boolean {
    return this.gameElement && this.gameElement instanceof Narrative;
  }

  getMedia(): Media {
    return (this.gameElement as Narrative).getCurrentMedia();
  }

  needsMediaUpload(): boolean {
    if (this.hasMedia()) {
      return this.narrative_type === NarrativeType.Audio || this.narrative_type === NarrativeType.Video;
    } else {
      return false;
    }
  }

  getImage(): Image {
    return this.gameElement.description.image || new Image();
  }
}