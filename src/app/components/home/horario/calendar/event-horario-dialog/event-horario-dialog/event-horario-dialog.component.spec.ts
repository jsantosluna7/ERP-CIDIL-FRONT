import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventHorarioDialogComponent } from './event-horario-dialog.component';

describe('EventHorarioDialogComponent', () => {
  let component: EventHorarioDialogComponent;
  let fixture: ComponentFixture<EventHorarioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventHorarioDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventHorarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
