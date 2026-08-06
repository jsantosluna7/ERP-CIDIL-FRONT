import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquiposUsuarioComponent } from './equipos-usuario.component';

describe('EquiposUsuarioComponent', () => {
  let component: EquiposUsuarioComponent;
  let fixture: ComponentFixture<EquiposUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquiposUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquiposUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
