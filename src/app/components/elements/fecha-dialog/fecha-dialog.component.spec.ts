import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FechaDialogComponent } from './fecha-dialog.component';

describe('FechaDialogComponent', () => {
  let component: FechaDialogComponent;
  let fixture: ComponentFixture<FechaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FechaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FechaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
