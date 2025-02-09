import { Injectable } from '@angular/core';

import { Chase, createUniqueId, GameElement, Image, Media,Narrative, Quest } from 'chase-model';

@Injectable({
  providedIn: 'root'
})
export class ChaseEditorService {
  private chase = new Chase();

  private gameElementNameMap: Map<number, string>;
  private gameElementNameList: string[];
  public narrativeNames: string[];
  public questNames: string[];

  constructor() {
    this.initElementNames();
  }

  private initElementNames(): void {
    this.gameElementNameMap = new Map<number, string>();
    this.gameElementNameList = [];
    this.questNames = [];
    this.narrativeNames = [];

    console.log('Contained GameElements (' + this.chase.gameElements.size + '):');

    this.chase.gameElements.forEach((value: GameElement, key: number) => {
      const titleWithId = value.title + ' (' + key + ')';
      this.gameElementNameMap.set(key, titleWithId);
      this.gameElementNameList.push(titleWithId);
      if (value instanceof Quest) {
        console.log('Quest:' + titleWithId);
        this.questNames.push(titleWithId);
      } else if (value instanceof Narrative) {
        console.log('Narrative:' + titleWithId);
        this.narrativeNames.push(titleWithId);
      }
    });
  }

  public setChase(chase: Chase): void {
    this.chase = chase;
    this.initElementNames();
  }

  public getChase(): Chase {
    return this.chase;
  }

  public getElementIdByName(name: string): number {
    let idText = name.substr(name.lastIndexOf('(') + 1);
    idText = idText.substr(0, idText.length - 1);
    return +idText;
  }

  public getElementNameById(id: number) {
    return this.gameElementNameMap.get(id);
  }

  public getElementNames(): string[] {
    return this.gameElementNameList;
  }

  public addGameElement(element: GameElement): number {
    const id = this.getFreeElementId();
    this.chase.gameElements.set(id, element);
    this.initElementNames();
    return id;
  }

  public deleteGameElement(id: number): void {
    this.chase.gameElements.delete(id);
    this.initElementNames();
  }

  private getFreeElementId(): number {
    let id = 1;
    while (true) {
      if (!this.chase.gameElements.has(id)) {
        return id;
      }
      id++;
    }
  }

  public getNarrativeNames(): string[] {
    return this.narrativeNames;
  }

  public getQuestNames(): string[] {
    return this.questNames;
  }

  public hasChaseId(): boolean {
    if (this.chase && this.chase.metaData.chaseId && this.chase.metaData.chaseId !== '') {
      return true;
    } else {
      return false;
    }
  }

  public getChaseId(): string {
    if (this.chase && this.chase.metaData.chaseId) {
      return this.chase.metaData.chaseId;
    } else {
      return '';
    }
  }

  public getMedia<T extends Media>(id: string): T {
    return this.chase.getMedia<T>(id);
  }
  public setMedia(id: string, media: Media): void {
    this.chase.media.set(id, media);
  }
  public getImages(): Image[] {
    const list = new Array<Image>();
    for (const media of this.chase.media.values()){
      if (media instanceof Image) {
        list.push(media);
      }
    }
    return list;
  }
  public getMediaList(): Media[] {
    const list = new Array<Media>();
    for (const media of this.chase.media.values()){
      list.push(media);
    }
    return list;
  }

  statusSaved = true;
  elementTitleCallbacks = new Array<{(): void;}>();

  public notifyElementChanged(): void {
    this.statusSaved = false;
  }

  public notifyElementTitleChanged(): void {
    console.log('ChaseEditor: element title was changed');
    this.elementTitleCallbacks.forEach((c: {(): void;}) => c());
    this.initElementNames();
    this.notifyElementChanged();
  }

  public notifySaved(): void {
    this.statusSaved = true;
  }

  public registerCallbackElementTitleChanged(callback: {(): void;}): void {
    this.elementTitleCallbacks.push(callback);
  }
}
