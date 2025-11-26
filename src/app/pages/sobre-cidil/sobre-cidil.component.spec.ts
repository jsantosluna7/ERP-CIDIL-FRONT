import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreCidilComponent } from './sobre-cidil.component';

describe('SobreCidilComponent', () => {
  let component: SobreCidilComponent;
  let fixture: ComponentFixture<SobreCidilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobreCidilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SobreCidilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
