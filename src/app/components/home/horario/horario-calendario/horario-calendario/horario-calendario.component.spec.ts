import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioCalendarioComponent } from './horario-calendario.component';

describe('HorarioCalendarioComponent', () => {
  let component: HorarioCalendarioComponent;
  let fixture: ComponentFixture<HorarioCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioCalendarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
