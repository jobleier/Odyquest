import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameElementComponent } from './game-element.component';

describe('GameElementComponent', () => {
  let component: GameElementComponent;
  let fixture: ComponentFixture<GameElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
