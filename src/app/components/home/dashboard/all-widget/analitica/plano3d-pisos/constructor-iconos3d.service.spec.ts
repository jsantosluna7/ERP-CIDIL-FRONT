import { TestBed } from '@angular/core/testing';

import { ConstructorIconos3dService } from './constructor-iconos3d.service';

describe('ConstructorIconos3dService', () => {
  let service: ConstructorIconos3dService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstructorIconos3dService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
