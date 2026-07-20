import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarLabDialogComponent } from './agregar-lab-dialog.component';

describe('AgregarLabDialogComponent', () => {
  let component: AgregarLabDialogComponent;
  let fixture: ComponentFixture<AgregarLabDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarLabDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarLabDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
