import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chase } from 'chase-model';
import { GameService } from 'src/app/core/services/game.service';
import { GameElementComponent } from './game-element.component';

describe('GameElementComponent', () => {
  let component: GameElementComponent;
  let fixture: ComponentFixture<GameElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameElementComponent ],
       providers: [
         { provide: GameService, useValue: { chase: new Chase()} }
       ]
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
