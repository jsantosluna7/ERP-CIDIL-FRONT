import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateHorarioDialogComponent } from './date-horario-dialog.component';

describe('DateHorarioDialogComponent', () => {
  let component: DateHorarioDialogComponent;
  let fixture: ComponentFixture<DateHorarioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateHorarioDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateHorarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
