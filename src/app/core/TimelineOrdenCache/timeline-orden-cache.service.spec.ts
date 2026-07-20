import { TestBed } from '@angular/core/testing';
import { TimelineOrdenCacheService } from './timeline-orden-cache.service';

describe('TimelineOrdenCacheService', () => {
  let service: TimelineOrdenCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelineOrdenCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
