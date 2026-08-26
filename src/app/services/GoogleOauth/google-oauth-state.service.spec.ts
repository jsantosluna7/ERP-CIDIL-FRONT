import { TestBed } from '@angular/core/testing';

import { GoogleOauthStateService } from './google-oauth-state.service';

describe('GoogleOauthStateService', () => {
  let service: GoogleOauthStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleOauthStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
