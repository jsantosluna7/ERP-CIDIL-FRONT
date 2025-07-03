import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliticaTodaComponent } from './analitica-toda.component';

describe('AnaliticaTodaComponent', () => {
  let component: AnaliticaTodaComponent;
  let fixture: ComponentFixture<AnaliticaTodaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnaliticaTodaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnaliticaTodaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
