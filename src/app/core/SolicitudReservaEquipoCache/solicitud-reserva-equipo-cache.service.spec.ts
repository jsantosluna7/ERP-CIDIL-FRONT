import { TestBed } from '@angular/core/testing';

import { SolicitudReservaEquipoCacheService } from './solicitud-reserva-equipo-cache.service';

describe('SolicitudReservaEquipoCacheService', () => {
  let service: SolicitudReservaEquipoCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudReservaEquipoCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
