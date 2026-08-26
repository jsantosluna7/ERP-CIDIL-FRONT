import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { googleOauthGuard } from './google-oauth.guard';

describe('googleOauthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => googleOauthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
