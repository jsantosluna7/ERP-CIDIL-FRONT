import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface OrdenesItems {
  id: number;
}

@Component({
  selector: 'app-actualizar-estatus',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './actualizar-estatus.component.html',
  styleUrl: './actualizar-estatus.component.css',
})
export class ActualizarEstatusComponent {
  readonly dialogRef = inject(MatDialogRef<ActualizarEstatusComponent>);
  readonly data = inject<OrdenesItems>(MAT_DIALOG_DATA);
  readonly id = model(this.data.id);

  onNoCancelar(): void {
    this.dialogRef.close();
  }

  onSiActualizar(): void {
  }
}
