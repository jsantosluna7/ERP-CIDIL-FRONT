import { TestBed } from '@angular/core/testing';

import { CantidadOrdenesCacheService } from './cantidad-ordenes-cache.service';

describe('CantidadOrdenesCacheService', () => {
  let service: CantidadOrdenesCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CantidadOrdenesCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
