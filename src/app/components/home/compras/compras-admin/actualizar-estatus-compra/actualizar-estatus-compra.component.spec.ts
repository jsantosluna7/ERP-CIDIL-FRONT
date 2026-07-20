import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarEstatusCompraComponent } from './actualizar-estatus-compra.component';

describe('ActualizarEstatusCompraComponent', () => {
  let component: ActualizarEstatusCompraComponent;
  let fixture: ComponentFixture<ActualizarEstatusCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarEstatusCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarEstatusCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
