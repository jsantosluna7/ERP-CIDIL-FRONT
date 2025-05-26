import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaEquipoComponent } from './reserva-equipo.component';

describe('ReservaEquipoComponent', () => {
  let component: ReservaEquipoComponent;
  let fixture: ComponentFixture<ReservaEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaEquipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
