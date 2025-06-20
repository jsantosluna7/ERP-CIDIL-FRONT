import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttChartsComponent } from './mqtt-charts.component';

describe('MqttChartsComponent', () => {
  let component: MqttChartsComponent;
  let fixture: ComponentFixture<MqttChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MqttChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MqttChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
