import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionTimelineComponent } from './informacion-timeline.component';

describe('InformacionTimelineComponent', () => {
  let component: InformacionTimelineComponent;
  let fixture: ComponentFixture<InformacionTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacionTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacionTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
