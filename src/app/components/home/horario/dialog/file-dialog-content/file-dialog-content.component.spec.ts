import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDialogContentComponent } from './file-dialog-content.component';

describe('FileDialogContentComponent', () => {
  let component: FileDialogContentComponent;
  let fixture: ComponentFixture<FileDialogContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDialogContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileDialogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
