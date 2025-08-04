import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioHomeComponent } from './calendario-home.component';

describe('CalendarioHomeComponent', () => {
  let component: CalendarioHomeComponent;
  let fixture: ComponentFixture<CalendarioHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
