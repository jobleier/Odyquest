import { Component, OnInit } from '@angular/core';

import { ChaseService } from 'chase-services';
import { Chase, ChaseMetaData, GameElement } from 'chase-model';

@Component({
  selector: 'app-meta-data-editor',
  templateUrl: './meta-data-editor.component.html',
  styleUrls: ['./meta-data-editor.component.scss']
})
export class MetaDataEditorComponent implements OnInit {
  public chase: Chase;

  title = '';
  author = '';
  description = '';
  published = false;
  initialElement = '';
  imageUrl = '';

  gameElementsMap = new Map<number, string>();
  gameElementsList = [];

  // FIXME outsource to own lib
  static parseIdFromGEString(text: string): number {
    let idText = text.substr(text.lastIndexOf('(') + 1);
    idText = idText.substr(0, idText.length - 1);
    return +idText;
  }

  constructor(
    private chaseService: ChaseService,
  ) { }

  ngOnInit(): void {
  }

  setChase(chase: Chase): void {
    this.chase = chase;

    this.title = this.chase.metaData.title;
    this.author = this.chase.metaData.author;
    this.description = this.chase.metaData.preview.description.text;
    this.imageUrl = this.chase.metaData.preview.description.image;

    // create gameelementsmap (id -> string)
    // also create simple array used to generate dropdown values
    this.gameElementsMap = new Map<number, string>();
    this.gameElementsList = [];

    this.chase.gameElements.forEach((value: GameElement, key: number) => {
      const titleWithId = value.title + ' (' + key + ')';
      this.gameElementsMap.set(key, titleWithId);
      this.gameElementsList.push(titleWithId);
    });

    this.initialElement = this.gameElementsMap.get(this.chase.initialGameElement);
    this.published = this.chase.metaData.published;
  }

  onInitialGameElementChange(value: string) {
    this.chase.initialGameElement = MetaDataEditorComponent.parseIdFromGEString(value);
    this.initialElement = value;
    console.log('Set initial game element to ' + this.chase.initialGameElement);
  }

  saveInputElements(): void {
    this.chase.metaData.published = this.published;
    this.chase.metaData.title = this.title;
    this.chase.metaData.author = this.author;
    this.chase.metaData.preview.description.text = this.description;
    this.chase.metaData.preview.description.image = this.imageUrl;
    this.chase.metaData.published = this.published;
  }

  uploadMedia($event): void {
    console.log('Opening file explorer to load local media file...');
    console.log($event.target.files[0]);
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      console.log('upload file...');
      this.chaseService
        .createMedia(
          this.chase.metaData.chaseId,
          '(unnamed)',
          $event.target.files[0]
        )
        .subscribe((res) => {
          console.log('...done: ' + res);
          // update image and url fields
          this.imageUrl = res;
        });
    });
    reader.readAsArrayBuffer($event.target.files[0]);
  }

}