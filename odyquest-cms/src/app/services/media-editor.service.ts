import { Injectable } from '@angular/core';

import { ChaseEditorService} from './chase-editor.service';
import { Chase, createUniqueId, GameElement, Image, Media,Narrative, Quest } from 'chase-model';

@Injectable({
  providedIn: 'root'
})
export class MediaEditorService {
  constructor(private chaseEditor: ChaseEditorService) {
  }

  getMedia(mediaId: string): Media {
    return this.chaseEditor.getMedia(mediaId);
  }

  getImage(mediaId: string): Image {
    return this.chaseEditor.getMedia<Image>(mediaId);
  }
  public setImage(id: string, image: Image): void {
    this.setMedia(id, image);
  }
  public setMedia(id: string, media: Media): void {
    this.chaseEditor.setMedia(id, media);
  }

  getChaseId(): string {
    return this.chaseEditor.getChaseId();
  }
  hasChaseId(): boolean {
    return this.chaseEditor.hasChaseId();
  }

  public createMedia(media: Media): string {
    let existing: string[] = [];
    for (const media of this.chaseEditor.getMediaList()) {
      existing.push(media.mediaId);
    }
    let id = createUniqueId(existing);
    media.mediaId = id;
    this.chaseEditor.setMedia(id, media);
    return id;
  }

  uploadMediaFile($event): void {
  }
}
