import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttTableComponent } from './mqtt-table.component';

describe('MqttTableComponent', () => {
  let component: MqttTableComponent;
  let fixture: ComponentFixture<MqttTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MqttTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MqttTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
