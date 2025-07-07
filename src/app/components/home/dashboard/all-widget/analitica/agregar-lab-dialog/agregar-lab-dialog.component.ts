import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-agregar-lab-dialog',
  imports: [CommonModule, MatInputModule, MatButtonModule, FormsModule, MatDialogModule],
  templateUrl: './agregar-lab-dialog.component.html',
  styleUrl: './agregar-lab-dialog.component.css',
})
export class AgregarLabDialogComponent {
  nombreLab: string = '';

  constructor(private dialogRef: MatDialogRef<AgregarLabDialogComponent>) {}

  cerrar() {
    this.dialogRef.close();
  }

  guardar() {
    if (!this.nombreLab.trim()) return;
    this.dialogRef.close(this.nombreLab.trim());
  }
}
