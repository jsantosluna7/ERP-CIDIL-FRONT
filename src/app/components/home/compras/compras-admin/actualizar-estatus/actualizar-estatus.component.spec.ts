import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarEstatusComponent } from './actualizar-estatus.component';

describe('ActualizarEstatusComponent', () => {
  let component: ActualizarEstatusComponent;
  let fixture: ComponentFixture<ActualizarEstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarEstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarEstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
