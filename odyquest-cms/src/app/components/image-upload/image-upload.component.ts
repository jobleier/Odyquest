import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ChaseService } from 'chase-services';
import { RuntimeConfigurationService } from 'chase-services';
import { Image, ImageFile } from 'chase-model';
import { MediaEditorService } from 'src/app/services/media-editor.service';
import { ImageSelectionComponent } from 'src/app/components/image-selection/image-selection.component';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {

  @Input() mediaId: string;
  @Input() label: string;
  @Output() mediaIdChange: EventEmitter<string> = new EventEmitter();

  constructor(
    private chaseService: ChaseService,
    private configuration: RuntimeConfigurationService,
    public imageEditor: MediaEditorService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  hasImage(): boolean {
    return this.mediaId && this.mediaId !== ''
      && this.imageEditor.getImage(this.mediaId) instanceof Image;
  }

  addImage(): void {
    const image = new Image();
    image.chaseId = this.imageEditor.getChaseId();
    if (this.hasImage()) {
      image.mediaId = this.mediaId;
    } else {
      this.mediaId = this.imageEditor.createMedia(image);
      this.mediaIdChange.emit(this.mediaId);
      console.log('Created new media entry with id ', this.mediaId);
    }
    if (this.configuration.isApiBased()) {
      this.chaseService.createOrUpdateMedia(image).subscribe(id => {
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
    if (!this.imageEditor.hasChaseId()) {
      console.error('ChaseId not set, can not upload media file.');
      return;
    }
    if (!this.mediaId || this.mediaId === '') {
      console.log('MediaId not set, can not upload media file.');
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      console.log('upload file with chaseId', this.imageEditor.getChaseId(), ' and mediaId ', this.mediaId);
      this.chaseService
        .createMediaFile(
          this.imageEditor.getChaseId(),
          this.mediaId,
          $event.target.files[0]
        )
        .subscribe((media) => {
          console.log('...uploading done');
          this.imageEditor.setImage(this.mediaId, media as Image);
        });
    });
    reader.readAsArrayBuffer($event.target.files[0]);
  }

  getDefaultImageUrl(): string {
    const image = this.imageEditor.getImage(this.mediaId);
    if (!(this.mediaId) || !(image instanceof Image)) {
      console.warn('MediaId not set or does not point to image, can not get url to image.');
      return '';
    }
    return image.getDefaultUrl(this.configuration.getMediaUrlPrefix());
  }

  updateImageUrl(event: any): void {
    if (!(this.mediaId)) {
      console.log('MediaId not set, can not set url.');
      return;
    }
    const image = this.imageEditor.getImage(this.mediaId);
    // replace all existing files with given url
    image.files = [new ImageFile(event.target.value, 1)];
    image.defaultIndex = 0;
    this.imageEditor.setImage(this.mediaId, image);
  }

  canUploadNewImage(): boolean {
    return this.configuration.isApiBased() && !this.hasFiles();
  }

  hasFiles(): boolean {
    return this.mediaId && this.mediaId !== ''
      && this.imageEditor.getImage(this.mediaId) instanceof Image
      && this.imageEditor.getImage(this.mediaId).hasFiles();
  }

  getMatCardImageClass(): string {
    return 'game_element_image';
  }

  selectImage(): void {
    const dialogRef = this.dialog.open(ImageSelectionComponent, {
      height: '90vh',
      width: '90vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== '') {
        console.log(`Select media id ${result}`);
        this.mediaId = result
        this.mediaIdChange.emit(this.mediaId);
      }
    });
  }

  deleteImage(): void {
    this.mediaId = '';
    this.mediaIdChange.emit(this.mediaId);
    // TODO clean up media list
  }

  getImage(): Image {
    return this.imageEditor.getImage(this.mediaId);
  }
}
