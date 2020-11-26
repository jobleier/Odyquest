import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';


import { Narrative } from '../../../shared/models/narrative';

@Component({
  selector: 'app-narrative',
  templateUrl: './narrative.component.html',
  styleUrls: ['./narrative.component.scss']
})
export class NarrativeComponent implements OnInit {
  @Input() narrative: Narrative;
  @Output() selection: EventEmitter<number> = new EventEmitter();



  constructor(private router: Router, private sanitizer:DomSanitizer) { }


  ngOnInit(): void {
  }

  select(button: number): void {
    // console.log('narrative: ' + button + ' selected');
    if (this.narrative.isFinal()) {
      console.log('Finished final narrative');
      setTimeout(() => { this.router.navigateByUrl('/finished'); }, 1500);
    } else {
      this.selection.emit(button);
    }
  }

  getImage(): SafeResourceUrl {
     return this.sanitizer.bypassSecurityTrustUrl(this.narrative.description.image);
  }
}