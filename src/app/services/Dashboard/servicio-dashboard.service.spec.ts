import { TestBed } from '@angular/core/testing';

import { ServicioDashboardService } from './servicio-dashboard.service';

describe('ServicioDashboardService', () => {
  let service: ServicioDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
