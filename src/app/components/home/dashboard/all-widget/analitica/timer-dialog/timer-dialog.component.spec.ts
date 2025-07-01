import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerDialogComponent } from './timer-dialog.component';

describe('TimerDialogComponent', () => {
  let component: TimerDialogComponent;
  let fixture: ComponentFixture<TimerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
