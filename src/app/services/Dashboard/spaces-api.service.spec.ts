import { TestBed } from '@angular/core/testing';

import { SpacesApiService } from './spaces-api.service';

describe('SpacesApiService', () => {
  let service: SpacesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpacesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
