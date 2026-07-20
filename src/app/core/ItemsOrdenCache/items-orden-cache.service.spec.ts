import { TestBed } from '@angular/core/testing';

import { ItemsOrdenCacheService } from './items-orden-cache.service';

describe('ItemsOrdenCacheService', () => {
  let service: ItemsOrdenCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsOrdenCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
