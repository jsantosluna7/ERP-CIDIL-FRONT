import { TestBed } from '@angular/core/testing';

import { AuthGuardOtp } from './auth-guard-otp.service';

describe('AuthGuardOtp', () => {
  let service: AuthGuardOtp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuardOtp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
