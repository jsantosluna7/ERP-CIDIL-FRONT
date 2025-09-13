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
  selector: 'app-dialog-solicitud-lab',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './dialog-solicitud-lab.component.html',
  styleUrl: './dialog-solicitud-lab.component.css',
})
export class DialogSolicitudLabComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogSolicitudLabComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      comentario: string;
    }
  ) {}
  onOk() {
    this.dialogRef.close();
  }
}
