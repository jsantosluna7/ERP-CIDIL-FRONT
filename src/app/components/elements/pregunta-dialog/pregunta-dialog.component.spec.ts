import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaDialogComponent } from './pregunta-dialog.component';

describe('PreguntaDialogComponent', () => {
  let component: PreguntaDialogComponent;
  let fixture: ComponentFixture<PreguntaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
