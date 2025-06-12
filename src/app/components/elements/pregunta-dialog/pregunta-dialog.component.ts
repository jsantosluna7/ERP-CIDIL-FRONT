import { Component, Inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-pregunta-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,],
  templateUrl: './pregunta-dialog.component.html',
  styleUrl: './pregunta-dialog.component.css'
})
export class PreguntaDialogComponent {
  readonly selection = model(true);

  constructor(
    public dialogRef: MatDialogRef<PreguntaDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titulo: string;
      mensaje: string;
    }
  ) {}

  onNo(){
    this.dialogRef.close();
  }
}
