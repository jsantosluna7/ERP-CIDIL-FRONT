import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Plano3dPisosComponent } from './plano3d-pisos.component';

describe('Plano3dPisosComponent', () => {
  let component: Plano3dPisosComponent;
  let fixture: ComponentFixture<Plano3dPisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Plano3dPisosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Plano3dPisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
