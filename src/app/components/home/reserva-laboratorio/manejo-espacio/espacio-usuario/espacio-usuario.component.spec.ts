import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspacioUsuarioComponent } from './espacio-usuario.component';

describe('EspacioUsuarioComponent', () => {
  let component: EspacioUsuarioComponent;
  let fixture: ComponentFixture<EspacioUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspacioUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspacioUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
