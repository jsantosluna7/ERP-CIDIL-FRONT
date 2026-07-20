import { TestBed } from '@angular/core/testing';

import { EstadosTimelineCacheService } from './estados-timeline-cache.service';

describe('EstadosTimelineCacheService', () => {
  let service: EstadosTimelineCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadosTimelineCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
