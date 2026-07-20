import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FileDialogContentComponent } from '../file-dialog-content/file-dialog-content.component';

@Component({
  selector: 'app-file-dialog',
  imports: [MatDialogModule, FileDialogContentComponent],
  templateUrl: './file-dialog.component.html',
  styleUrl: './file-dialog.component.css'
})
export class FileDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nombre: string }
  ) { }
}
