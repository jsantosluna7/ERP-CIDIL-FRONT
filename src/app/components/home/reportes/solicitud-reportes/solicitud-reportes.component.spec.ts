import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudReportesComponent } from './solicitud-reportes.component';

describe('SolicitudReportesComponent', () => {
  let component: SolicitudReportesComponent;
  let fixture: ComponentFixture<SolicitudReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudReportesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
