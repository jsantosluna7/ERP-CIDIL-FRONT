import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorSolapamientoComponent } from './error-solapamiento.component';

describe('ErrorSolapamientoComponent', () => {
  let component: ErrorSolapamientoComponent;
  let fixture: ComponentFixture<ErrorSolapamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorSolapamientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorSolapamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
