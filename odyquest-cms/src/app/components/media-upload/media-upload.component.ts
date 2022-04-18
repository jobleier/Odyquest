import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Audio, AudioFile, AugmentedReality, Media, MediaFile, MediaWithFilelist, NarrativeType, Video, VideoFile } from 'chase-model';
import { ChaseService } from 'chase-services';
import { RuntimeConfigurationService } from 'chase-services';
import { MediaEditorService } from 'src/app/services/media-editor.service';

@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.scss']
})
export class MediaUploadComponent implements OnInit {

  @Input() mediaId: string;
  @Input() narrativeType: NarrativeType;
  @Output() mediaIdChange: EventEmitter<string> = new EventEmitter();

  constructor(
    private chaseService: ChaseService,
    private configuration: RuntimeConfigurationService,
    public mediaEditor: MediaEditorService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  hasMedia(): boolean {
    return this.mediaId && this.mediaId !== ''
      && this.mediaEditor.getMedia(this.mediaId) !== undefined;
  }

  addMedia(): void {
    const media = this.createMediaFromType();
    media.chaseId = this.mediaEditor.getChaseId();
    if (this.hasMedia()) {
      media.mediaId = this.mediaId;
    } else {
      this.mediaId = this.mediaEditor.createMedia(media);
      this.mediaIdChange.emit(this.mediaId);
      console.log('Created new media entry with id ', this.mediaId);
    }
    if (this.configuration.isApiBased()) {
      this.chaseService.createOrUpdateMedia(media).subscribe(id => {
        if (id === this.mediaId) {
          this.mediaIdChange.emit(this.mediaId);
        } else {
          console.error('Pushed new media entry to server and server responded with different id.');
        }
      });
    } else {
      this.mediaIdChange.emit(this.mediaId);
    }
  }

  uploadMedia($event): void {
    console.log($event.target.files[0]);
    if (!this.mediaEditor.hasChaseId()) {
      console.error('ChaseId not set, can not upload media file.');
      return;
    }
    if (!this.mediaId || this.mediaId === '') {
      console.log('MediaId not set, can not upload media file.');
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      console.log('upload file with chaseId', this.mediaEditor.getChaseId(), ' and mediaId ', this.mediaId);
      this.chaseService
        .createMediaFile(
          this.mediaEditor.getChaseId(),
          this.mediaId,
          $event.target.files[0]
        )
        .subscribe((media) => {
          console.log('...uploading done');
          this.mediaEditor.setMedia(this.mediaId, media);
        });
    });
    reader.readAsArrayBuffer($event.target.files[0]);
  }

  getDefaultMediaUrl(): string {
    const image = this.mediaEditor.getMedia(this.mediaId);
    if (!(this.mediaId) || !(image instanceof Media)) {
      console.warn('MediaId not set or does not point to image, can not get url to image.');
      return '';
    }
    return image.getDefaultUrl(this.configuration.getMediaUrlPrefix());
  }

  createFileEntryFromUrl(url: string) {
    switch (this.narrativeType) {
      case NarrativeType.Audio:
        return new AudioFile(url, '', 0);
      case NarrativeType.Video:
        return new VideoFile(url, '', 0);
      case NarrativeType.AugmentedReality:
        return new MediaFile(url);
      default:
        console.error('Create media of unknown type');
  }
  }
  updateMediaUrl(event: any): void {
    if (!(this.mediaId)) {
      console.log('MediaId not set, can not set url.');
      return;
    }
    const media = this.mediaEditor.getMedia(this.mediaId) as MediaWithFilelist<MediaFile>;
    // replace all existing files with given url
    media.files = [this.createFileEntryFromUrl(event.target.value)];
    media.defaultIndex = 0;
    this.mediaEditor.setMedia(this.mediaId, media);
  }

  canUploadMedia(): boolean {
    return this.configuration.isApiBased();
  }

  hasFiles(): boolean {
    return this.mediaId && this.mediaId !== ''
      && this.mediaEditor.getMedia(this.mediaId) instanceof this.getMediaType()
      && this.mediaEditor.getMedia(this.mediaId).hasFiles();
  }

  deleteImage(): void {
    this.mediaId = '';
    this.mediaIdChange.emit(this.mediaId);
    // TODO clean up media list
  }

  getMedia(): Media {
    return this.mediaEditor.getMedia(this.mediaId);
  }

  hasAudio(): boolean {
    return this.narrativeType === NarrativeType.Audio;
  }
  hasVideo(): boolean {
    return this.narrativeType === NarrativeType.Video;
  }
  getMediaType(): new (...params: any[]) => Media {
    switch (this.narrativeType) {
      case NarrativeType.Audio:
        return Audio;
      case NarrativeType.Video:
        return Video;
    }
  }
  createMediaFromType(): Media {
    switch (this.narrativeType) {
      case NarrativeType.Audio:
        return new Audio();
      case NarrativeType.Video:
        return new Video();
      case NarrativeType.AugmentedReality:
        return new AugmentedReality();
      default:
        console.error('Create media of unknown type');
    }
  }
}
