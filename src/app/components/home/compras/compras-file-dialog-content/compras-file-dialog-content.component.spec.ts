import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasFileDialogContentComponent } from './compras-file-dialog-content.component';

describe('ComprasFileDialogContentComponent', () => {
  let component: ComprasFileDialogContentComponent;
  let fixture: ComponentFixture<ComprasFileDialogContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasFileDialogContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasFileDialogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
