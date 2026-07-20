import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-event-horario-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './event-horario-dialog.component.html',
  styleUrl: './event-horario-dialog.component.css',
})
export class EventHorarioDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EventHorarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      asignatura: string;
      profesor: string;
      labNombre: string;
      dia: string;
      horaInicio: string;
      horaFinal: string;
      fechaInicio: string;
      fechaFinal: string;
    }
  ) {}
  onOk() {
    this.dialogRef.close();
  }
}
