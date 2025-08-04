import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateDialogHomeComponent } from './date-dialog-home.component';

describe('DateDialogHomeComponent', () => {
  let component: DateDialogHomeComponent;
  let fixture: ComponentFixture<DateDialogHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateDialogHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateDialogHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
