import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSolicitudEquipComponent } from './dialog-solicitud-equip.component';

describe('DialogSolicitudLabComponent', () => {
  let component: DialogSolicitudEquipComponent;
  let fixture: ComponentFixture<DialogSolicitudEquipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSolicitudEquipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSolicitudEquipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
