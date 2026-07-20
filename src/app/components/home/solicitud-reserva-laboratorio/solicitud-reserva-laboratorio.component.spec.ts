import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudReservaLaboratorioComponent } from './solicitud-reserva-laboratorio.component';

describe('SolicitudReservaLaboratorioComponent', () => {
  let component: SolicitudReservaLaboratorioComponent;
  let fixture: ComponentFixture<SolicitudReservaLaboratorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudReservaLaboratorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudReservaLaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
