import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IotButtonsComponent } from './iot-buttons.component';

describe('IotButtonsComponent', () => {
  let component: IotButtonsComponent;
  let fixture: ComponentFixture<IotButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IotButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IotButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
