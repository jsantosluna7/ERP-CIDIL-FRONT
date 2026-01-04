import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ComprasFileDialogContentComponent } from '../compras-file-dialog-content/compras-file-dialog-content.component';

@Component({
  selector: 'app-compras-file-dialog',
  imports: [MatDialogContent, ComprasFileDialogContentComponent],
  templateUrl: './compras-file-dialog.component.html',
  styleUrl: './compras-file-dialog.component.css',
})
export class ComprasFileDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ComprasFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nombre: string }
  ) {}
}
