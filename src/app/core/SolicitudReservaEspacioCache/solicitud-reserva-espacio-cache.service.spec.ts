import { TestBed } from '@angular/core/testing';

import { SolicitudReservaEspacioCacheService } from './solicitud-reserva-espacio-cache.service';

describe('SolicitudReservaEspacioCacheService', () => {
  let service: SolicitudReservaEspacioCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudReservaEspacioCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
