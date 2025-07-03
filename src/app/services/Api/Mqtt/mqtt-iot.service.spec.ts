import { TestBed } from '@angular/core/testing';

import { MqttIOTService } from './mqtt-iot.service';

describe('MqttIOTService', () => {
  let service: MqttIOTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MqttIOTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
