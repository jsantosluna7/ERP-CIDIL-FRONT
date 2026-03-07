import { TestBed } from '@angular/core/testing';

import { LaboratorioCacheService } from './laboratorio-cache.service';

describe('LaboratorioCacheService', () => {
  let service: LaboratorioCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratorioCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
