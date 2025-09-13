import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSolicitudLabComponent } from './dialog-solicitud-lab.component';

describe('DialogSolicitudLabComponent', () => {
  let component: DialogSolicitudLabComponent;
  let fixture: ComponentFixture<DialogSolicitudLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSolicitudLabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSolicitudLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
