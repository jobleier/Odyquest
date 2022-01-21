import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Quest } from 'chase-model';
import { HintComponent } from './hint.component';

describe('HintComponent', () => {
  let component: HintComponent;
  let fixture: ComponentFixture<HintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HintComponent ],
      imports: [ MatDialogModule ],
      providers: [
        {provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {  quest: new Quest() } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HintComponent);
    component = fixture.componentInstance;
    //component.hint = new Hint();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
