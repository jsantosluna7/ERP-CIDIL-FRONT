import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElegirFechaComponent } from './elegir-fecha.component';

describe('ElegirFechaComponent', () => {
  let component: ElegirFechaComponent;
  let fixture: ComponentFixture<ElegirFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElegirFechaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElegirFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
