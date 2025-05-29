import { TestBed } from '@angular/core/testing';

import { ServicioWidgetService } from './servicio-widget.service';

describe('ServicioWidgetService', () => {
  let service: ServicioWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
