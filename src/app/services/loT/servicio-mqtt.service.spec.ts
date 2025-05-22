import { TestBed } from '@angular/core/testing';

import { ServicioMqttService } from './servicio-mqtt.service';

describe('ServicioMqttService', () => {
  let service: ServicioMqttService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioMqttService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
