import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttLabsComponent } from './mqtt-labs.component';

describe('MqttLabsComponent', () => {
  let component: MqttLabsComponent;
  let fixture: ComponentFixture<MqttLabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MqttLabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MqttLabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
