import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioTableComponent } from './horario-table.component';

describe('HorarioTableComponent', () => {
  let component: HorarioTableComponent;
  let fixture: ComponentFixture<HorarioTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
