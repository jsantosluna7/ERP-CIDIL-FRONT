import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasFileDialogComponent } from './compras-file-dialog.component';

describe('ComprasFileDialogComponent', () => {
  let component: ComprasFileDialogComponent;
  let fixture: ComponentFixture<ComprasFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasFileDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
