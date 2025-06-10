import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarHorarioComponent } from './eliminar-horario.component';

describe('EliminarHorarioComponent', () => {
  let component: EliminarHorarioComponent;
  let fixture: ComponentFixture<EliminarHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarHorarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
