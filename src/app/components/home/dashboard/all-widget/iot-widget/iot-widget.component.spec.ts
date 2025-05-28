import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IotWidgetComponent } from './iot-widget.component';

describe('IotWidgetComponent', () => {
  let component: IotWidgetComponent;
  let fixture: ComponentFixture<IotWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IotWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IotWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
