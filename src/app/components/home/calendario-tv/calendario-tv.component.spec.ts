import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioTvComponent } from './calendario-tv.component';

describe('CalendarioTvComponent', () => {
  let component: CalendarioTvComponent;
  let fixture: ComponentFixture<CalendarioTvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioTvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioTvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
