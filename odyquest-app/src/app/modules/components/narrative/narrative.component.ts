import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

import { Narrative, NarrativeStatus, NarrativeType } from 'chase-model';
import { ChaseStatus } from 'chase-model';
import { GameService } from 'src/app/core/services/game.service';
import { HintComponent } from '../hint/hint.component';

@Component({
  selector: 'app-narrative',
  templateUrl: './narrative.component.html',
  styleUrls: ['./narrative.component.scss']
})
export class NarrativeComponent implements OnInit {
  @Input() narrative: Narrative;
  @Output() selection: EventEmitter<number> = new EventEmitter();
  @Output() chaseStatus: EventEmitter<ChaseStatus> = new EventEmitter();

  constructor(public dialog: MatDialog, private sanitizer: DomSanitizer) { }


  ngOnInit(): void {
    if (!this.showTextByDefault()) {
      // hide text field
      this.hideText();
    }
  }

  select(button: number): void {
    if (this.narrative.isFinal()) {
      let chaseStatus: ChaseStatus;
      switch (this.narrative.narrativeStatus) {
          case NarrativeStatus.Win:
          chaseStatus = ChaseStatus.Succeeded;
          break;
          case NarrativeStatus.Loose:
          chaseStatus = ChaseStatus.Failed;
          break;
      }
      this.chaseStatus.emit(chaseStatus);
    } else {
      this.selection.emit(button);
    }
  }

  hint(): void {
    const dialogRef = this.dialog.open(HintComponent, {
      height: '90vh',
      width: '90vw',
      data: {quest: this.narrative},
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Submitted: ${result}`);
    });
  }

  needsTitleRow(): boolean {
    return this.hasHelp() || !!this.narrative.title;
  }

  hasHelp(): boolean {
    return this.narrative.help.length > 0;
  }

  getMediaUrl(): SafeResourceUrl {
    if (!this.narrative.media_url) {
      return this.sanitizer.bypassSecurityTrustUrl('');
    }
    return this.sanitizer.bypassSecurityTrustUrl(this.narrative.media_url);
  }

  getMediaType(): string {
    if (!this.narrative.media_type) {
      return '';
    }
    return this.narrative.media_type;
  }

  isTextType(): boolean {
    return this.narrative.narrativeType === NarrativeType.Text;
  }
  isAudioType(): boolean {
    return this.narrative.narrativeType === NarrativeType.Audio;
  }
  isVideoType(): boolean {
    return this.narrative.narrativeType === NarrativeType.Video;
  }

  showImage(): boolean {
    return this.isTextType() || this.isAudioType();
  }
  showTextByDefault(): boolean {
    return this.isTextType();
  }

  getImgClass(): string {
    return 'game_element_image';
  }

  showText(): void {
    document.getElementById('game_element_text').style.display = 'block';
    document.getElementById('text_show_button').style.display = 'none';
    document.getElementById('text_hide_button').style.display = 'block';
  }
  hideText(): void {
    document.getElementById('game_element_text').style.display = 'none';
    document.getElementById('text_show_button').style.display = 'block';
    document.getElementById('text_hide_button').style.display = 'none';
  }
}
