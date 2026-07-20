import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudReservaEquipoComponent } from './solicitud-reserva-equipo.component';

describe('SolicitudReservaEquipoComponent', () => {
  let component: SolicitudReservaEquipoComponent;
  let fixture: ComponentFixture<SolicitudReservaEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudReservaEquipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudReservaEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
